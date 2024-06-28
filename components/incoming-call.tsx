'use client';
import { Rocket, X } from 'lucide-react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Reservation } from 'twilio-taskrouter';
import { useTwilio } from '@/providers/twilio-provider';

type Props = {
	reservations?: Reservation[];
};

const IncomingCall = ({}: Props) => {
	const { reservations } = useTwilio();
	// const reservations = useRecoilValue(reservationAtom);
	// console.log(reservations);

	return (
		<>
			{reservations &&
				reservations.length > 0 &&
				reservations.map((r) => {
					const task = r.task;
					const { attributes } = task;
					return (
						<Card
							key={r.sid}
							className={cn('absolute bottom-1.5 right-1.5 shadow-sm')}
						>
							<CardHeader className='flex-row items-center p-3 gap-12 border-b'>
								<CardTitle>
									<Rocket className='h-3.5 w-3.5 inline-block mr-1.5 text-yellow-400' />
									<span className='text-sm font-normal'>{task.queueName}</span>
								</CardTitle>

								<CardDescription>
									Incoming call
									<X className='h-3.5 w-3.5 inline-block ml-1.5 text-gray-400 cursor-pointer' />
								</CardDescription>
							</CardHeader>

							<CardContent className='flex flex-col items-center p-3 space-y-3'>
								<Avatar>
									<AvatarImage src='/placeholder-user.jpg' />
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
										await r.reject();
									}}
								>
									Decline
								</Button>

								<Button
									className='bg-green-600 hover:bg-green-600/90 text-sm'
									onClick={async () => {
										const conference = await r.conference({
											from: attributes.from,
											to: 'client:nblack_40velomethod_2Ecom',
										});
										console.log(conference);
									}}
								>
									Accept
								</Button>
							</CardFooter>
						</Card>
					);
				})}
		</>
	);
};

export default IncomingCall;
