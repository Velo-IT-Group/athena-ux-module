'use client';
import { Rocket, X } from 'lucide-react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { PopoverClose } from '@radix-ui/react-popover';
import { ReservationInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/worker/reservation';
import ReservationAcceptButton from './reservation-accept-button';
import { Reservation, Task } from 'twilio-taskrouter';

type Props = {
	reservation: Reservation;
	task: Task;
};

const IncomingTask = ({ reservation, task }: Props) => {
	const { attributes } = task;

	return (
		<Card
			key={reservation.sid}
			className='shadow-none border-none'
		>
			<CardHeader className='flex-row items-center p-3 gap-12 border-b'>
				<CardTitle>
					<Rocket className='h-3.5 w-3.5 inline-block mr-1.5 text-yellow-400' />
					<span className='text-sm font-normal'>{task.queueName}</span>
				</CardTitle>

				<CardDescription>
					Incoming call
					{/* <Button
						variant='ghost'
						size='icon'
						className='p-0 w-9 h-9'
						onClick={() => toast.dismiss(attributes.call_sid)}
					>
					
						
					</Button> */}
					<PopoverClose>
						<X className='h-3.5 w-3.5 inline-block text-gray-400 cursor-pointer' />
					</PopoverClose>
				</CardDescription>
			</CardHeader>

			<CardContent className='flex flex-col items-center p-3 space-y-3'>
				<Avatar>
					<AvatarImage src='/placeholder-usereservation.jpg' />
					<AvatarFallback>AC</AvatarFallback>
				</Avatar>
				<div className='text-center'>
					<p className='font-medium text-sm'>{attributes.name}</p>
					<p className='text-gray-400 text-xs'>is calling {task.queueName}</p>
				</div>
			</CardContent>

			<CardFooter className='flex justify-center space-x-3'>
				<Button
					variant='destructive'
					className='text-sm'
					// onClick={async () => {
					// 	await reservation.reject();
					// }}
				>
					Decline
				</Button>

				<Button
					variant='accepting'
					size={'sm'}
					className='text-sm'
					onClick={async () => {
						await reservation.conference({
							beep: false,
							startConferenceOnEnter: true,
							endConferenceOnExit: true,
						});
					}}
				>
					Accept
				</Button>

				{/* <ReservationAcceptButton
					attributes={attributes}
					to={reservation.workerName}
					from={attributes.from}
					reservationSid={reservation.sid}
					taskSid={task.sid}
				/> */}
			</CardFooter>
		</Card>
	);
};

export default IncomingTask;
