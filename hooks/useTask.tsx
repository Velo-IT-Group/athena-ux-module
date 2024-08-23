'use client';
import { updateConferenceAction } from '@/components/active-call/actions';
import { useDevice } from '@/providers/device-provider';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Task } from 'twilio-taskrouter';

export type ConferenceParticpant = Record<string, Record<string, string>>;

export type ConferenceAttributes = {
	sid: string;
	participants: ConferenceParticpant;
};

const useTask = (defaultTask: Task) => {
	const { activeCall } = useDevice();
	const searchParams = new URLSearchParams();
	const [task, setTask] = useState<Task>(defaultTask);
	const [attributes, setAttributes] = useState<Record<string, any>>(defaultTask.attributes);
	const [conference, setConference] = useState<ConferenceAttributes>(defaultTask.attributes.conference);
	searchParams.set('contactId', defaultTask.attributes.contactId);
	searchParams.set('companyId', defaultTask.attributes.companyId);

	const conferenceStub = {
		conference: {
			sid: '',
			participants: {
				worker: {
					sid: '',
					name: 'You',
				},
				customer: {
					sid: '',
					name: attributes.name ?? attributes.from,
				},
			},
		},
	};

	useEffect(() => {
		if (!defaultTask) return;

		setTask(defaultTask);
		setAttributes(defaultTask.attributes);
		setConference(defaultTask.attributes.conference ?? conferenceStub);

		if (task.attributes.conference) {
			setTimeout(() => {
				task.fetchLatestVersion().then((task) => {
					setTask(task);
					setAttributes(task.attributes);
					setConference(
						task.attributes.conference
							? {
									...conferenceStub.conference,
									...task.attributes.conference,
									sid: task.attributes.conference.sid,
									participants: {
										worker: {
											...conferenceStub.conference.participants.worker,
											sid: task.attributes.conference.participants.worker.sid,
										},
										customer: {
											...conferenceStub.conference.participants.customer,
											sid: task.attributes.conference.participants.customer.sid,
										},
									},
							  }
							: conferenceStub
					);
				});
			}, 1000);
		}
	}, [defaultTask]);

	const endConference = async () => {
		activeCall?.disconnect();
		await updateConferenceAction(task?.attributes.conference.sid, {
			status: 'completed',
		});
		await task?.wrapUp({ reason: 'Call ended' });
	};

	return {
		task,
		attributes,
		conference,
		endConference,
		searchParams,
	};
};

export default useTask;
