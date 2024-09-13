'use client';
import { Card } from '@/components/ui/card';
import ActiveCallHeader from './header';
import ActiveCallFooter from './footer';
import ActiveCallParticipants from './participants';
import { Task } from 'twilio-taskrouter';
import useTask from '@/hooks/useTask';
import useConference from '@/hooks/useConference';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

type Props = {
	task: Task;
};

export function ActiveCall({ task }: Props) {
	// const { data } = useQuery({
	// 	queryKey: ['queryParticipants', task.attributes.conference.sid],
	// 	queryFn: () => client.conferences(task.attributes.conference.sid).fetch(),
	// });

	// console.log(data);

	const { transferTask, conference } = useTask(task);
	const { addConferenceParticipantMutation, conferenceParticipants, endConference, updateConferenceParticipantsState } =
		useConference({
			conference,
			task,
		});

	useEffect(() => {
		if (!conference) return;
		updateConferenceParticipantsState(conference.participants);
	}, [conference]);

	// const confP = { ...conference.participants, ...conferenceParticipants };

	return (
		<Card>
			<ActiveCallHeader
				queueName={task.queueName}
				searchParams={new URLSearchParams()}
			/>

			<ActiveCallParticipants
				sid={conference.sid}
				participants={conferenceParticipants ?? {}}
			/>

			<ActiveCallFooter
				task={task}
				endConference={endConference}
				transferTask={transferTask}
				addConferenceParticipantMutation={addConferenceParticipantMutation}
			/>
		</Card>
	);
}
