'use client';
import { useContext, useState, createContext, useEffect } from 'react';
import { CustomTaskAttributes } from '@/types/twilio';
import { TaskAttributes } from 'twilio/lib/twiml/VoiceResponse';
import { UseMutateFunction, useMutation, UseMutationResult, useQuery } from '@tanstack/react-query';
import useTask, { ConferenceAttributes, ConferenceParticpant } from '@/hooks/useTask';
import { type Task, TransferOptions } from 'twilio-taskrouter';
import { toast } from 'sonner';
import useConference from '@/hooks/useConference';
import { useWorker } from './worker-provider';
import { parsePhoneNumber } from '@/lib/utils';
import { getConferenceParticipants, updateConference } from '@/lib/twilio/conference/helpers';
import { ConferenceInstance } from 'twilio/lib/rest/api/v2010/account/conference';

interface Props {
	conference: ConferenceAttributes | undefined;
	conferenceParticipants: ConferenceParticpant | undefined;
	endConference: UseMutateFunction<ConferenceInstance, Error, void, unknown> | undefined;
	task: Task | undefined;
	setTask: React.Dispatch<React.SetStateAction<Task | undefined>>;
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
	conference: undefined,
	conferenceParticipants: undefined,
	endConference: undefined,
	task: undefined,
	setTask: () => undefined,
	transferTask: undefined,
	wrapUpTask: undefined,
};

type WithChildProps = {
	children: React.ReactNode;
};

const context = createContext(initialValues);
const { Provider } = context;

export const TwilioTaskContext = ({ children }: WithChildProps) => {
	const { worker } = useWorker();
	const [task, setTask] = useState<Task>();
	const [attributes, setAttributes] = useState<Record<string, any>>();
	const [conference, setConference] = useState<ConferenceAttributes>(task?.attributes?.conference || {});
	const [conferenceParticipants, setConferenceParticipants] = useState<ConferenceParticpant>();

	useEffect(() => {
		if (!conference.participants) return;

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
	}, [conference.participants]);

	const queryParticipants = useQuery({
		queryKey: ['participants', conference.sid],
		queryFn: () => getConferenceParticipants(conference.sid),
	});

	const { mutate: endConference } = useMutation({
		mutationFn: () => updateConference(conference.sid, { status: 'completed' }),
	});

	useEffect(() => {
		if (!task?.attributes?.conference) return;

		setConference((prev) => {
			return {
				...prev,
				participants: {
					...prev.participants,
					worker: {
						sid: worker?.sid,
						name: worker?.attributes.full_name,
					},
					customer: {
						sid: prev.participants.customer,
						name: task.attributes.name ?? task.attributes.from,
					},
				},
			};
		});
	}, [task?.attributes?.conference]);

	const transferTask = useMutation({
		mutationFn: ({ to, options }: { to: string; options: TransferOptions }) => task!.transfer(to, options),
		onSuccess: (data, variables, context) => {
			setConference((prev) => {
				return {
					...prev,
					participants: {
						...prev.participants,
						transferedWorker: {
							name: '',
							sid: variables.to,
						},
					},
				};
			});
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

	useEffect(() => {
		if (!task) return;
		setAttributes(task.attributes);
		setConference(task.attributes.conference);
	}, [task]);

	return (
		<Provider
			value={{
				task,
				setTask,
				conference,
				conferenceParticipants,
				endConference,
				transferTask,
				wrapUpTask,
				// muteParticipant,
				// holdParticipant,
				// removeParticipant,
				// isLoading,
				// queryParticipants,
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
