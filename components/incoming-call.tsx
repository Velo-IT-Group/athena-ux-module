'use server';
import { Rocket, X } from 'lucide-react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { PopoverClose } from '@radix-ui/react-popover';
import { ReservationInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/worker/reservation';
import ReservationAcceptButton from './reservation-accept-button';

type Props = {
	reservation: ReservationInstance;
	task: TaskInstance;
};

const IncomingTask = async ({ reservation, task }: Props) => {
	const attributes = JSON.parse(task.attributes);

	return (
		<Card
			key={reservation.sid}
			className='shadow-none border-none'
		>
			<CardHeader className='flex-row items-center p-3 gap-12 border-b'>
				<CardTitle>
					<Rocket className='h-3.5 w-3.5 inline-block mr-1.5 text-yellow-400' />
					<span className='text-sm font-normal'>{task.taskQueueFriendlyName}</span>
				</CardTitle>

				<CardDescription>
					Incoming call
					{/* <Button
						variant='ghost'
						size='icon'
						className='p-0 w-8 h-8'
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
					<p className='text-gray-400 text-xs'>is calling {task.taskQueueFriendlyName}</p>
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

				<ReservationAcceptButton
					attributes={attributes}
					to={reservation.workerName}
					from={attributes.from}
					reservationSid={reservation.sid}
					taskSid={task.sid}
				/>
			</CardFooter>
		</Card>
	);
};

export default IncomingTask;
