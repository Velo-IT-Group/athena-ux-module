import { auth } from '@/auth';
import {
	getOngoingTasks,
	getTask,
	getWorkerReservations,
	updateWorkerReservation,
} from '@/lib/twilio/taskrouter/helpers';
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';
import IncomingTask from './incoming-call';
import ServerTaskListItem from './server-task-list copy';

type Props = {};

const ServerTaskList = async (props: Props) => {
	const session = await auth();
	const reservations = await getWorkerReservations();

	// reservations.forEach((reservation) => {
	// 	getTask(reservation.taskSid)
	// 		.then((task) => {
	// 			console.log('reservation');
	// 			updateWorkerReservation(reservation.sid, {
	// 				conferenceStatusCallbackEvent: ['start', 'end', 'join', 'leave', 'mute', 'hold'],
	// 				to: `client:${reservation.workerName}`,
	// 				from: task.attributes?.from,
	// 				instruction: 'conference',
	// 			})
	// 				.then((d) => {
	// 					console.log('updating reservation', d);
	// 				})
	// 				.catch((e) => {
	// 					console.error(e);
	// 				});
	// 		})
	// 		.catch((e) => {
	// 			console.error(e);
	// 		});
	// });

	return (
		<section className='space-y-1.5 px-1.5'>
			<h2 className='text-xs text-muted-foreground px-3 font-medium'>Tasks</h2>

			<Popover>
				<div className='flex flex-col gap-1.5'>
					{reservations.map((reservation) => {
						// const { attributes } = reservation.task;

						return <ServerTaskListItem reservation={reservation} />;
					})}
				</div>
			</Popover>
		</section>
	);
};

export default ServerTaskList;
