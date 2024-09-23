'use client';
import { useContext, useState, createContext, useEffect } from 'react';
import { UseMutateFunction, useMutation, UseMutationResult, useQuery } from '@tanstack/react-query';
import { ConferenceAttributes, ConferenceParticpant } from '@/hooks/useTask';
import { type Task, TransferOptions } from 'twilio-taskrouter';
import { toast } from 'sonner';
import { useWorker } from '@/providers/worker-provider';
import { parsePhoneNumber } from '@/lib/utils';
import {
	createConferenceParticipant,
	getConferenceParticipants,
	updateConference,
} from '@/lib/twilio/conference/helpers';
import { ConferenceInstance } from 'twilio/lib/rest/api/v2010/account/conference';
import useConference from '@/hooks/useConference';
import { CreateParticipantParams } from '@/types/twilio';
import { useTwilio } from '@/providers/twilio-provider';
import { ParticipantInstance } from 'twilio/lib/rest/api/v2010/account/conference/participant';

interface Props {
	addExternalParticipant:
		| UseMutationResult<
				ParticipantInstance,
				Error,
				{
					To: string;
					From: string;
				}
		  >
		| undefined;
	conference: ConferenceAttributes | undefined;
	conferenceParticipants: ConferenceParticpant;
	endConference: UseMutateFunction<ConferenceInstance, Error, void, unknown> | undefined;
	task: Task | undefined;
	transferTask:
		| UseMutationResult<
				Task,
				Error,
				{
					to: string;
					options: TransferOptions;
				},
				unknown
		  >
		| undefined;
	wrapUpTask: UseMutationResult<Task, Error, string, unknown> | undefined;
}

const initialValues: Props = {
	addExternalParticipant: undefined,
	conference: undefined,
	conferenceParticipants: {},
	endConference: undefined,
	task: undefined,
	transferTask: undefined,
	wrapUpTask: undefined,
};

type WithChildProps = {
	task: Task;
	children: React.ReactNode;
};

const context = createContext(initialValues);
const { Provider } = context;

export const TaskContext = ({ task, children }: WithChildProps) => {
	const { workspace } = useTwilio();
	const { worker } = useWorker();
	const { conference } = task.attributes;
	const [conferenceParticipants, setConferenceParticipants] = useState<ConferenceParticpant>({});

	useEffect(() => {
		if (!conference?.participants) return;
		setConferenceParticipants(conference.participants);
	}, [conference?.participants]);

	const { mutate: endConference } = useMutation({
		mutationFn: () => updateConference(conference.sid, { status: 'completed' }),
	});

	const addExternalParticipant = useMutation({
		mutationFn: async (params: { To: string; From: string }) => {
			// const { formattedNumber } = parsePhoneNumber(params.To, 'US', 'E.164');
			return await createConferenceParticipant(conference.sid, params);
		},
		onSuccess(data, variables, context) {
			setConferenceParticipants((prev) => {
				return {
					...prev,
					external: {
						...data,
						name: parsePhoneNumber(variables.To).formattedNumber,
					},
				};
			});

			task.setAttributes({
				...task.attributes,
				conference: {
					...task.attributes.conference,
					conferenceParticipants,
				},
			});
		},
	});

	useEffect(() => {
		if (!conference?.participants) return;

		setConferenceParticipants((prev) => {
			return {
				...prev,
				worker: {
					sid: worker?.sid,
					name: worker?.attributes.full_name,
				},
				customer: {
					sid: task?.attributes.conference.participants.customer,
					name: task?.attributes.name ? task?.attributes.name : parsePhoneNumber(task?.attributes.from).formattedNumber,
				},
			};
		});
	}, [conference?.participants]);

	useEffect(() => {
		if (!task) return;
		console.log(task);
		setConferenceParticipants(task.attributes?.conference?.participants);
	}, [task]);

	const transferTask = useMutation({
		mutationFn: ({ to, options }: { to: string; options: TransferOptions }) => task!.transfer(to, options),
		onSuccess: async (data, variables, context) => {
			const worker = await workspace?.fetchWorker(variables.to);
			setConferenceParticipants((prev) => {
				return {
					...prev,
					transferedWorker: {
						name: worker?.attributes.full_name,
						sid: variables.to,
					},
				};
			});

			try {
				data
					.setAttributes({
						...data.attributes,
						conference: {
							...data.attributes.conference,
						},
					})
					.then(console.log);
			} catch (error) {
				console.error(error);
			}
		},
		onError: (error) => {
			toast.error('Error transferring task' + error.message);
		},
	});

	const wrapUpTask = useMutation({
		mutationFn: (reason: string) => task!.wrapUp({ reason }),
		onError: (error) => {
			toast.error('Error transferring task' + error.message);
		},
	});

	return (
		<Provider
			value={{
				addExternalParticipant,
				task,
				conferenceParticipants,
				conference,
				endConference,
				transferTask,
				wrapUpTask,
			}}
		>
			{children}
		</Provider>
	);
};

export const useTaskContext = () => {
	const state = useContext(context);

	return state;
};
