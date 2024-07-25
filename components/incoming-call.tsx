'use client';
import { Rocket, X } from 'lucide-react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ConferenceOptions, Reservation } from 'twilio-taskrouter';
import { getConferenceByName } from '@/lib/twilio/conference/helpers';
import { useTwilio } from '@/providers/twilio-provider';
import { toast } from 'sonner';

type Props = {
	reservation: Reservation;
};

const IncomingTask = ({ reservation }: Props) => {
	const { activeCall, setActiveCall } = useTwilio();
	const task = reservation.task;
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
						className='p-0 w-8 h-8'
						onClick={() => toast.dismiss(attributes.call_sid)}
					>
						<X className='h-3.5 w-3.5 inline-block text-gray-400 cursor-pointer' />
					</Button> */}
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
					onClick={async () => {
						await reservation.reject();
					}}
				>
					Decline
				</Button>

				<Button
					className='bg-green-600 hover:bg-green-600/90 text-sm'
					onClick={async () => {
						await reservation.conference();

						// const conference = await getConferenceByName(task.sid);

						// console.log(task.sid, conference);
						// setActiveCall(activeCall ? { ...activeCall, conference } : { conference });

						// console.log(conference);
					}}
				>
					Accept
				</Button>
			</CardFooter>
		</Card>
	);
};

export default IncomingTask;
