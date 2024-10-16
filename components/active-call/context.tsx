'use client';
import { useContext, useState, createContext, useEffect } from 'react';
import { UseMutateFunction, useMutation, UseMutationResult } from '@tanstack/react-query';
import { ConferenceAttributes, ConferenceParticpant } from '@/hooks/useTask';
import { type Task, TransferOptions } from 'twilio-taskrouter';
import { toast } from 'sonner';
import { createConferenceParticipant, updateConference } from '@/lib/twilio/conference/helpers';
import { ConferenceInstance } from 'twilio/lib/rest/api/v2010/account/conference';
import { ParticipantInstance } from 'twilio/lib/rest/api/v2010/account/conference/participant';
import useTimer from '@/hooks/useTimer';
import { Participant } from './participant-list-item';
import { useTwilio } from '@/providers/twilio-provider';

interface Props {
	addExternalParticipant:
		| UseMutationResult<
				ParticipantInstance,
				Error,
				{
					To: string;
					From: string;
					attributes?: Record<any, any>;
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
				void,
				Error,
				{
					to: string;
					options: TransferOptions;
				},
				unknown
		  >
		| undefined;
	wrapUpTask: UseMutationResult<Task, Error, string, unknown> | undefined;
	removeParticipantByName: (name: Participant) => void;
	updateParticipants: (
		key: Participant,
		sid: string,
		operation?: 'insert' | 'delete'
	) => Promise<ConferenceParticpant | undefined>;
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
	updateParticipants: async () => undefined,
};

type WithChildProps = {
	task: Task;
	children: React.ReactNode;
};

const context = createContext(initialValues);
const { Provider } = context;

export const TaskContext = ({ task, children }: WithChildProps) => {
	const { conference } = task.attributes;
	const { workspace } = useTwilio();
	const [conferenceParticipants, setConferenceParticipants] = useState<ConferenceParticpant>({});
	const timer = useTimer();

	const updateParticipants = async (key: Participant, sid: string, operation: 'insert' | 'delete' = 'insert') => {
		let newParticipants;
		if (operation === 'insert') {
			newParticipants = {
				...conferenceParticipants,
				[key]: sid,
			};
		} else {
			let participants = conferenceParticipants;
			delete participants[key];
			newParticipants = participants;
		}

		console.log({
			...task.attributes.conference,
			participants: newParticipants,
		});

		await task.setAttributes({
			...task.attributes,
			conference: {
				...task.attributes.conference,
				participants: newParticipants,
			},
		});

		setConferenceParticipants(newParticipants);

		return newParticipants;
	};

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
		mutationFn: async (params: { To: string; From: string; attributes?: Record<any, any> }) => {
			const participant = await createConferenceParticipant(conference.sid, params);
			await updateParticipants('external', participant.callSid);
			await task.setAttributes({
				...task.attributes,
				...params?.attributes,
			});
			return participant;
		},
		onError(error, variables, context) {
			toast.error(JSON.stringify(error));
		},
	});

	const removeParticipantByName = (name: Participant) => {
		updateParticipants(name, '', 'delete');
	};

	useEffect(() => {
		if (task === undefined || task === null || !task.attributes || task.attributes.conference) return;
		setConferenceParticipants(task.attributes?.conference?.participants);
	}, [task.attributes.conference]);

	const transferTask = useMutation({
		mutationFn: async ({ to, options }: { to: string; options: TransferOptions }) => {
			const worker = await workspace?.fetchWorker(to);
			await task!.transfer(to, options);
			await updateParticipants('transferredWorker', worker?.attributes.full_name);
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
				updateParticipants,
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
