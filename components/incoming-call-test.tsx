'use client';
import { Rocket, X } from 'lucide-react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getConferenceByName } from '@/lib/twilio/conference/helpers';
import { Reservation } from 'twilio-taskrouter';
import { toast } from 'sonner';
import { Call } from '@twilio/voice-sdk';

type Props = {
	toastId: number | string;
	r: Call;
};

const IncomingCallTest = ({ toastId, r }: Props) => {
	return (
		<Card className={cn('w-[356px] shadow-sm')}>
			<CardHeader className='flex-row items-center justify-between p-3 gap-12 border-b space-y-0'>
				<CardTitle className='flex items-center'>
					<Rocket className='h-3.5 w-3.5 inline-block mr-1.5 text-yellow-400' />
					<span className='text-sm font-normal'>Testing</span>
				</CardTitle>

				<CardDescription className='flex items-center'>
					Incoming call
					<Button
						variant='ghost'
						size='icon'
						className='p-0 w-8 h-8'
						onClick={() => toast.dismiss(toastId)}
					>
						<X className='h-3.5 w-3.5 inline-block text-gray-400 cursor-pointer' />
					</Button>
				</CardDescription>
			</CardHeader>

			<CardContent className='flex flex-col items-center p-3 space-y-3'>
				<Avatar>
					<AvatarImage src='/placeholder-user.jpg' />
					<AvatarFallback>AC</AvatarFallback>
				</Avatar>
				<div className='text-center'>
					<p className='font-medium text-sm'>Nick</p>
					<p className='text-gray-400 text-xs'>is calling Quueue</p>
				</div>
			</CardContent>

			<CardFooter className='flex justify-center space-x-3'>
				<Button
					variant='destructive'
					className='text-sm'
					onClick={async () => {
						// await r.reject();
					}}
				>
					Decline
				</Button>

				<Button
					className='bg-green-600 hover:bg-green-600/90 text-sm'
					onClick={() => {
						r.accept();
						// const reservation = await r.conference({
						// 	from: attributes.from,
						// });
						// const conference = await getConferenceByName(reservation.task.sid);
						// setActiveCall(activeCall ? { ...activeCall, conference } : { conference });
					}}
				>
					Accept
				</Button>
			</CardFooter>
		</Card>
	);
};

export default IncomingCallTest;
