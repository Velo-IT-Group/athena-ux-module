import React, { useState } from 'react';
import { PhoneIncoming, X } from 'lucide-react';
import { Reservation } from 'twilio-taskrouter';
import useTimer from '@/hooks/useTimer';
import Timer from './timer';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './ui/alert-dialog';

type Props = {
	reservation: Reservation;
};

export default function ReservationItem({ reservation }: Props) {
	const { task } = reservation;
	const timer = useTimer(task.dateUpdated);
	const [open, setOpen] = useState(false);

	const taskChannel = task.taskChannelUniqueName;

	return (
		<div className='flex items-center border rounded'>
			<div className='flex items-stretch rounded overflow-hidden relative h-6 text-ellipsis shrink'>
				<div className='flex items-center gap-1.5 px-1.5 text-xs'>
					<PhoneIncoming className='w-3 h-3' />

					<span className='whitespace-nowrap overflow-hidden text-ellipsis max-w-36'>{task.attributes.name}</span>
				</div>

				{/* <Separator orientation='vertical' />

				<div
					className='overflow-hidden gap-1.5 flex items-center px-1.5 relative text-xs'
					aria-label={reservation.status}
				>
					<span className='capitalize max-w-36 overflow-hidden whitespace-nowrap text-ellipsis'>
						{reservation.status}
					</span>
				</div> */}

				<Separator orientation='vertical' />

				<Timer
					timer={timer}
					className='px-1.5 flex items-center min-w-0 relative text-xs grow-0'
				/>

				<Separator orientation='vertical' />

				<AlertDialog
					open={open}
					onOpenChange={setOpen}
				>
					<AlertDialogTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
							className='flex items-center min-w-0 relative text-xs h-auto w-auto rounded-none px-1.5'
						>
							<X />
						</Button>
					</AlertDialogTrigger>

					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						</AlertDialogHeader>

						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction asChild>
								<Button
									onClick={async () => {
										await reservation.complete();
										setOpen(false);
									}}
								>
									Confirm
								</Button>
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
}
