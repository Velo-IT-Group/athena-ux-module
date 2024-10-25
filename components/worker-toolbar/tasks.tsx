'use client';
import useReservations from '@/hooks/useReservations';
import { useWorker } from '@/providers/worker-provider';
import React from 'react';
import { Button } from '../ui/button';
import { Phone } from 'lucide-react';

type Props = {};

const Tasks = (props: Props) => {
	const { worker } = useWorker();
	const { reservations, addReservation, removeReservation } = useReservations();

	return (
		<div>
			{reservations.map((reservation) => {
				const { task } = reservation;
				const taskChannel = task.taskChannelUniqueName;

				return (
					<Button
						variant='ghost'
						size='icon'
					>
						{(taskChannel === 'voice' || taskChannel === 'default') && <Phone />}
					</Button>
				);
			})}
			Tasks
		</div>
	);
};

export default Tasks;
