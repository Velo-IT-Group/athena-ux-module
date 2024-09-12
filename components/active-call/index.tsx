'use client';
import { Card } from '@/components/ui/card';
import ActiveCallHeader from './header';
import ActiveCallFooter from './footer';
import ActiveCallParticipants from './participants';
import { Task, Workspace } from 'twilio-taskrouter';
import useTask from '@/hooks/useTask';
import useConference from '@/hooks/useConference';
import { useEffect } from 'react';

type Props = {
	task: Task;
};

export function ActiveCall({ task }: Props) {
	const { transferTask, conference } = useTask(task);
	const { addConferenceParticipantMutation, conferenceParticipants, endConference, setConferenceParticipants } =
		useConference({
			conference,
			task,
		});

	useEffect(() => {
		// if (!conference) return;
		const part = conference.participants;
		setConferenceParticipants((prev) => {
			return { ...prev, ...part };
		});
	}, [conference.participants]);

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
