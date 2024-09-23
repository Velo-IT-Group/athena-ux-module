'use client';
import { parsePhoneNumber } from '@/lib/utils';
import { useTwilio } from '@/providers/twilio-provider';
import { useWorker } from '@/providers/worker-provider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Task, TransferOptions, Workspace } from 'twilio-taskrouter';

export type ConferenceParticpant = Record<string, Record<string, any>>;

export type ConferenceAttributes = {
	sid: string;
	participants: ConferenceParticpant;
};

const useTask = (task: Task) => {
	const { worker } = useWorker();
	const [attributes, setAttributes] = useState<Record<string, any>>();
	const [conference, setConference] = useState<ConferenceAttributes>(task?.attributes?.conference || {});
	const { workspace } = useTwilio();
	const { data: workers, isLoading: isWorkersLoading } = useQuery({
		queryKey: ['workers'],
		queryFn: () => workspace?.fetchWorkers(),
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
						sid: task.attributes.conference.participants.customer,
						name: task.attributes.name ? task.attributes.name : parsePhoneNumber(task.attributes.from).formattedNumber,
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
							name: workers?.get(variables.to)?.attributes.full_name,
							sid: variables.to,
						},
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

	return {
		conference,
		transferTask,
		wrapUpTask,
	};
};

export default useTask;
