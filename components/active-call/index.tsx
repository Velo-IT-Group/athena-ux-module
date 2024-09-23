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
				queueName={task.queueName}
				searchParams={new URLSearchParams()}
			/>

			<ActiveCallParticipants />

			<ActiveCallFooter />
		</Card>
	);
}
