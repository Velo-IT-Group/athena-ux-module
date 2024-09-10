'use client';
import { Card } from '@/components/ui/card';
import ActiveCallHeader from './header';
import ActiveCallFooter from './footer';
import ActiveCallParticipants from './participants';
import { Task } from 'twilio-taskrouter';

type Props = {
	task: Task;
};

export function ActiveCall({ task }: Props) {
	return (
		<Card>
			<ActiveCallHeader
				task={task}
				searchParams={new URLSearchParams()}
			/>

			<ActiveCallParticipants participants={task.attributes.conference.participants} />

			<ActiveCallFooter task={task} />
		</Card>
	);
}
