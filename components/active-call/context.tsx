'use client';
import { useContext, useState, createContext, useEffect, useMemo } from 'react';
import { UseMutateFunction, useMutation, UseMutationResult } from '@tanstack/react-query';
import { ConferenceAttributes, ConferenceParticpant } from '@/hooks/useTask';
import { type Task, TransferOptions } from 'twilio-taskrouter';
import { toast } from 'sonner';
import { useWorker } from '@/providers/worker-provider';
import { parsePhoneNumber } from '@/lib/utils';
import { createConferenceParticipant, updateConference } from '@/lib/twilio/conference/helpers';
import { ConferenceInstance } from 'twilio/lib/rest/api/v2010/account/conference';
import { useTwilio } from '@/providers/twilio-provider';
import { ParticipantInstance } from 'twilio/lib/rest/api/v2010/account/conference/participant';
import useTimer from '@/hooks/useTimer';

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
	completeTask: UseMutationResult<void, Error, void, unknown> | undefined;
	conference: ConferenceAttributes | undefined;
	conferenceParticipants: ConferenceParticpant;
	endConference: UseMutateFunction<ConferenceInstance, Error, void, unknown> | undefined;
	task: Task | undefined;
	timer: {
		seconds: number;
		minutes: number;
		hours: number;
	};
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
	removeParticipantByName: (name: string) => void;
}

const initialValues: Props = {
	addExternalParticipant: undefined,
	conference: undefined,
	conferenceParticipants: {},
	completeTask: undefined,
	timer: {
		hours: 0,
		minutes: 0,
		seconds: 0,
	},
	endConference: undefined,
	task: undefined,
	transferTask: undefined,
	wrapUpTask: undefined,
	removeParticipantByName: () => undefined,
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
	const timer = useTimer();

	useEffect(() => {
		if (!conference?.participants) return;
		setConferenceParticipants(conference.participants);
	}, [conference?.participants]);

	const { mutate: endConference } = useMutation({
		mutationFn: () => updateConference(conference.sid, { status: 'completed' }),
		onError(error, variables, context) {
			toast.error(JSON.stringify(error));
		},
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
						// @ts-ignore
						sid: data.call_sid,
						name: parsePhoneNumber(variables.To).formattedNumber,
					},
				};
			});

			// task.setAttributes({
			// 	...task.attributes,
			// 	conference: {
			// 		...task.attributes.conference,
			// 		participants: conferenceParticipants,
			// 	},
			// });
		},
		onError(error, variables, context) {
			toast.error(JSON.stringify(error));
		},
	});

	const removeParticipantByName = (name: string) => {
		setConferenceParticipants((prev) => {
			delete prev[name];
			return prev;
		});
	};

	useEffect(() => {
		if (!conference?.participants) return;

		let customerName = '';
		if (task.attributes.direction === 'outbound') {
			customerName = parsePhoneNumber(task?.attributes.outbound_to).formattedNumber ?? '';
		} else {
			customerName = task?.attributes.name
				? task?.attributes.name
				: parsePhoneNumber(task?.attributes.from).formattedNumber;
		}

		setConferenceParticipants((prev) => {
			return {
				...prev,
				worker: {
					sid: task?.attributes.conference.participants.worker,
					workerSid: worker?.sid,
					name: worker?.attributes?.full_name,
				},
				customer: {
					sid: task?.attributes.conference.participants.customer,
					name: customerName,
				},
			};
		});
	}, [conference?.participants]);

	useEffect(() => {
		if (task === undefined || task === null || !task.attributes || task.attributes.conference) return;
		console.log(task);
		setConferenceParticipants(task.attributes?.conference?.participants);
	}, [task.attributes.conference]);

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
			toast.error('Error transferring task ' + JSON.stringify(error));
		},
	});

	const wrapUpTask = useMutation({
		mutationFn: (reason: string) => task!.wrapUp({ reason }),
		onError: (error) => {
			toast.error('Error transferring task ' + JSON.stringify(error));
		},
	});

	const completeTask = useMutation({
		mutationKey: ['completeTask'],
		mutationFn: async () => {
			await task?.complete('completed');
		},
	});

	return (
		<Provider
			value={{
				addExternalParticipant,
				task,
				completeTask,
				conferenceParticipants,
				conference,
				endConference,
				transferTask,
				timer,
				wrapUpTask,
				removeParticipantByName,
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
