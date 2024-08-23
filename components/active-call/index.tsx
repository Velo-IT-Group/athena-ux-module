'use client';
import { Card } from '@/components/ui/card';
import ActiveCallHeader from './header';
import ActiveCallFooter from './footer';
import ActiveCallParticipants from './participants';
import { Task } from 'twilio-taskrouter';
import useTask from '@/hooks/useTask';

type Props = {
	task: Task;
};

export function ActiveCall({ task: defaultTask }: Props) {
	const { task, attributes, conference, endConference, searchParams } = useTask(defaultTask);

	return (
		<Card>
			<ActiveCallHeader
				task={task}
				searchParams={searchParams}
			/>

			<ActiveCallParticipants participants={conference.participants} />

			<ActiveCallFooter
				task={task}
				endConference={endConference}
			/>
		</Card>
	);
}
