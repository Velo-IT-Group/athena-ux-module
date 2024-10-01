'use client';

import { useEffect, useState, Fragment } from 'react';
import { useWorker } from '@/providers/worker-provider';
import type { Reservation, Worker } from 'twilio-taskrouter';
import { useDevice } from '@/providers/device-provider';
import { SignalType } from '@gnaudio/jabra-js';
import { Separator } from '../ui/separator';
import useReservations from '@/hooks/useReservations';
import TaskNotification from '../task-notification';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Phone } from 'lucide-react';
import OutboundDialer from '../outbound-dialer';

type Props = {
	isCollapsed?: boolean;
	className?: string;
};

const TaskList = ({ isCollapsed, className }: Props) => {
	const { worker } = useWorker();
	const { currentCallControl } = useDevice();
	const [activeReservation, setActiveReservation] = useState<Reservation>();
	const { reservations, addReservation, removeReservation } = useReservations();

	const onReservationCreated = async (r: Reservation) => {
		console.log(currentCallControl);
		console.log(`Reservation ${r.sid} has been created for ${worker?.sid}`);
		addReservation(r);
		setActiveReservation(r);
		if (r.task.attributes.direction === 'outbound') {
			await r.conference({ beep: false });
		} else {
			try {
				currentCallControl?.ring(true);
			} catch (error) {
				console.log(error);
				toast.error(JSON.stringify(error));
			}
		}

		// if (
		// 	r.task.attributes.direction !== 'outbound' &&
		// 	currentCallControl &&
		// 	r.task.taskChannelUniqueName === 'voice' &&
		// 	r.status !== 'accepted'
		// ) {

		// }

		r.on('accepted', async (reservation) => {
			console.log('Call accepted');
			try {
				currentCallControl?.ring(false);
			} catch (error) {
				console.error(error);
				toast.error(JSON.stringify(error));
			}
		});

		r.on('rejected', async (reservation) => {
			try {
				removeReservation(reservation);
				currentCallControl?.ring(false);
				setActiveReservation(undefined);
			} catch (error) {
				console.error('No call pending', error);
				toast.error(JSON.stringify(error));
			}
		});

		r.on('canceled', async (reservation) => {
			try {
				removeReservation(reservation);
				currentCallControl?.ring(false);
				setActiveReservation(undefined);
			} catch (error) {
				console.error('No call pending', error);
				toast.error(JSON.stringify(error));
			}
		});

		r.on('wrapup', async (reservation) => {
			try {
				console.log('Wrapping up');
				removeReservation(reservation);
				currentCallControl?.ring(false);
				currentCallControl?.offHook(false);
				setActiveReservation(undefined);
			} catch (error) {
				toast.error(JSON.stringify(error));
			}
		});

		r.on('completed', async (reservation) => {
			try {
				removeReservation(reservation);
				currentCallControl?.ring(false);
				currentCallControl?.offHook(false);
				setActiveReservation(undefined);
			} catch (error) {
				toast.error(JSON.stringify(error));
			}
		});

		r.on('timeout', async (reservation) => {
			try {
				removeReservation(reservation);
				currentCallControl?.ring(false);
				setActiveReservation(undefined);
				currentCallControl?.offHook(false);
			} catch (error) {
				console.error('No call pending', error);
				toast.error(JSON.stringify(error));
			}
		});
	};

	const onWorkerReady = async (w: Worker) => {
		console.log('Worker Ready', w.sid);
		// setActivity(w.activity);
		// 	// setActivityList(w.activities);
		const reservations = Array.from(w.reservations.values());

		reservations.forEach((reservation) => {
			addReservation(reservation);
		});
	};

	// useEffect(() => {
	// 	if (!currentCallControl || !activeReservation) return;
	// 	currentCallControl?.deviceSignals.subscribe(async (d) => {
	// 		if (d.type === SignalType.HOOK_SWITCH) {
	// 			console.log(activeReservation);
	// 			await activeReservation?.conference({
	// 				beep: false,
	// 				endConferenceOnExit: false,
	// 				endConferenceOnCustomerExit: true,
	// 			});
	// 		}
	// 	});
	// }, [currentCallControl, activeReservation]);

	useEffect(() => {
		if (!worker) return;
		worker?.on('ready', onWorkerReady);

		return () => {
			worker?.off('ready', onWorkerReady);
		};
	}, [worker]);

	useEffect(() => {
		if (worker === undefined) return;

		worker?.on('reservationCreated', onReservationCreated);

		return () => {
			worker?.off('reservationCreated', onReservationCreated);
		};
	}, [worker, currentCallControl]);

	const incompleteTasks = reservations.filter((r) => r.status !== 'completed');

	return (
		<Fragment>
			<Separator />

			<section className='space-y-1.5 mx-1.5'>
				{!isCollapsed && <h2 className='text-xs text-muted-foreground px-3 font-medium'>Tasks</h2>}

				<>
					{incompleteTasks.length > 0 ? (
						<>
							{incompleteTasks.map((reservation) => (
								<TaskNotification
									key={reservation.sid}
									reservation={reservation}
									task={reservation.task}
									isCollapsed={isCollapsed}
								/>
							))}
						</>
					) : (
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant='ghost'
									size={isCollapsed ? 'icon' : 'sm'}
									className={cn(!isCollapsed && 'justify-start')}
								>
									<Phone className='fill-current stroke-none' />
									<span className={cn('ml-1.5', isCollapsed && 'sr-only')}>Outbound Dialer</span>
								</Button>
							</PopoverTrigger>

							<PopoverContent
								align='start'
								side='right'
							>
								<OutboundDialer />
							</PopoverContent>
						</Popover>
					)}
				</>
			</section>
		</Fragment>
	);
};

export default TaskList;
