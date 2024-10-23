'use client';

import { useEffect, useState, Fragment } from 'react';
import { useWorker } from '@/providers/worker-provider';
import type { Reservation, Worker } from 'twilio-taskrouter';
import { useDevice } from '@/providers/device-provider';
import { Separator } from '../ui/separator';
import useReservations from '@/hooks/useReservations';
import TaskNotification from '../task-notification';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Phone } from 'lucide-react';
import OutboundDialer from '../outbound-dialer';
import { useNotifications } from '@/providers/notification-provider';
import useRinger from '@/hooks/useRinger';

type Props = {
	isCollapsed?: boolean;
	className?: string;
};

const TaskList = ({ isCollapsed, className }: Props) => {
	const { worker } = useWorker();
	const { reservations, addReservation, removeReservation } = useReservations();
	const { createNotification } = useNotifications();
	const { togglePlayback } = useRinger();

	const onReservationCreated = async (r: Reservation) => {
		console.log(`Reservation ${r.sid} has been created for ${worker?.sid}`);
		const isVoicemail = r.task.attributes.taskType === 'voicemail';
		addReservation(r);
		if (r.task.attributes.direction === 'outbound') {
			await r.conference({
				beep: false,
			});
		} else if (isVoicemail) {
			createNotification(`New Voicemail From ${r.task.attributes.name}`);
		} else {
			createNotification(`New Phone Call From ${r.task.attributes.name}`);
			togglePlayback(true);
		}

		r.on('accepted', async (reservation) => {
			console.log('Call accepted');
			try {
				togglePlayback(false);
			} catch (error) {
				console.error(error);
				toast.error(JSON.stringify(error));
			}
		});

		r.on('rejected', async (reservation) => {
			try {
				togglePlayback(false);
				removeReservation(reservation);
			} catch (error) {
				console.error('No call pending', error);
				toast.error(JSON.stringify(error));
			}
		});

		r.on('canceled', async (reservation) => {
			try {
				togglePlayback(false);
				removeReservation(reservation);
			} catch (error) {
				console.error('No call pending', error);
				toast.error(JSON.stringify(error));
			}
		});

		r.on('wrapup', async () => {
			try {
				togglePlayback(false);
				console.log('Wrapping up');
			} catch (error) {
				toast.error(JSON.stringify(error));
			}
		});

		r.on('completed', async (reservation) => {
			try {
				togglePlayback(false);
				removeReservation(reservation);
			} catch (error) {
				toast.error(JSON.stringify(error));
			}
		});

		r.on('timeout', async (reservation) => {
			try {
				togglePlayback(false);
				removeReservation(reservation);
			} catch (error) {
				console.error('No call pending', error);
				toast.error(JSON.stringify(error));
			}
		});
	};

	const onWorkerReady = async (w: Worker) => {
		console.log('Worker Ready', w.sid);
		const reservations = Array.from(w.reservations.values());

		reservations.forEach((reservation) => {
			addReservation(reservation);
		});
	};

	useEffect(() => {
		if (!worker) return;
		worker?.on('ready', onWorkerReady);

		worker?.on('reservationCreated', onReservationCreated);

		worker?.on('reservationFailed', (reservation) => {
			togglePlayback(false);
			removeReservation(reservation);
		});

		worker.on('error', (e) => {
			console.error(e.message);
		});

		return () => {
			worker?.off('ready', onWorkerReady);
			worker?.off('reservationCreated', onReservationCreated);
		};
	}, [worker]);

	const imcomingCalls = reservations.filter(
		(r) =>
			(r.task.taskChannelUniqueName === 'voice' || r.task.taskChannelUniqueName === 'default') &&
			r.task.attributes.taskType !== 'voicemail'
	);

	return (
		<Fragment>
			<Separator />

			<section className='space-y-1.5 mx-1.5'>
				{!isCollapsed && <h2 className='text-xs text-muted-foreground px-3 font-medium'>Tasks</h2>}

				{imcomingCalls.length === 0 && (
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant='ghost'
								size={isCollapsed ? 'icon' : 'sm'}
								className={cn('w-full', !isCollapsed && 'justify-start')}
							>
								<Phone className='fill-current stroke-none' />
								<span className={cn('ml-1.5', isCollapsed && 'sr-only')}>Outbound Dialer</span>
							</Button>
						</PopoverTrigger>

						<PopoverContent
							align='start'
							side='right'
							sideOffset={12}
						>
							<OutboundDialer />
						</PopoverContent>
					</Popover>
				)}

				{reservations.map((reservation) => (
					<TaskNotification
						key={reservation.sid}
						reservation={reservation}
						task={reservation.task}
						isCollapsed={isCollapsed}
					/>
				))}
			</section>
		</Fragment>
	);
};

export default TaskList;
