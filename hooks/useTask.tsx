'use client';
import { updateConferenceAction } from '@/components/active-call/actions';
import { useDevice } from '@/providers/device-provider';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Task } from 'twilio-taskrouter';

export type ConferenceParticpant = Record<string, Record<string, string>>;

export type ConferenceAttributes = {
	sid: string;
	participants: ConferenceParticpant;
};

const useTask = (defaultTask: Task) => {
	const { activeCall } = useDevice();
	const searchParams = new URLSearchParams();
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

	const {
		data: task,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['task'],
		queryFn: () => defaultTask.fetchLatestVersion(),
	});

	console.log(error, isLoading, task);

	if (!isLoading) {
		// setTask(taskData);
		setAttributes(task?.attributes ?? {});
		setConference(
			task?.attributes.conference
				? {
						...conferenceStub.conference,
						...task?.attributes.conference,
						sid: task?.attributes.conference.sid,
						participants: {
							worker: {
								...conferenceStub.conference.participants.worker,
								sid: task?.attributes.conference.participants.worker.sid,
							},
							customer: {
								...conferenceStub.conference.participants.customer,
								sid: task?.attributes.conference.participants.customer.sid,
							},
						},
				  }
				: conferenceStub
		);
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
	}
};

export default useTask;
