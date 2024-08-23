'use client';
import { useEffect, useState } from 'react';
import { useWorker } from '@/providers/worker-provider';
import type { Reservation, Task, Worker } from 'twilio-taskrouter';
import TaskWrapup from '../task/wrapup';
import { toast } from 'sonner';
import { useDevice } from '@/providers/device-provider';
import { ActiveCall } from '../active-call';
import { SignalType } from '@gnaudio/jabra-js';
import { Separator } from '../ui/separator';
import useReservations from '@/hooks/useReservations';
import TaskNotification from '../task-notification';

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
		console.log(`Reservation ${r.sid} has been created for ${worker?.sid}`);
		try {
			addReservation(r);
			setActiveReservation(r);
			if (r.task.attributes.direction === 'outboundDial') {
				const res = await r.conference({ beep: false });
				// console.log(res.task);
				// toast.custom(
				// 	() => (
				// 		<ActiveCall
				// 			taskSid={r.task.sid}
				// 			attributes={r.task.attributes}
				// 			conferenceSid={r.task.attributes?.conference?.sid ?? ''}
				// 		/>
				// 	),
				// 	{
				// 		duration: Infinity,
				// 		dismissible: false,
				// 		important: true,
				// 		id: r.task.sid,
				// 	}
				// );
				// setActiveCall({ ...activeCall, task: res.task });
			}

			console.log(activeReservation);

			if (currentCallControl && r.task.taskChannelUniqueName === 'voice') {
				try {
					currentCallControl?.ring(true);
				} catch (error) {
					console.log(error);
				}
			}

			r.on('accepted', async (reservation) => {
				console.log('Call accepted');
				try {
					currentCallControl?.ring(false);
				} catch (error) {
					console.error(error);
				}

				// toast.custom(
				// 	() => (
				// 		<ActiveCall
				// 			taskSid={reservation.task.sid}
				// 			attributes={reservation.task.attributes}
				// 			conferenceSid={reservation.task.attributes?.conference?.sid ?? ''}
				// 		/>
				// 	),
				// 	{
				// 		duration: Infinity,
				// 		dismissible: false,
				// 		id: reservation.task.sid,
				// 	}
				// );
			});

			r.on('rejected', async (reservation) => {
				try {
					removeReservation(reservation);
					currentCallControl?.ring(false);
					setActiveReservation(undefined);
				} catch (error) {
					console.error('No call pending', error);
				}
			});

			r.on('canceled', async (reservation) => {
				try {
					removeReservation(reservation);
					currentCallControl?.ring(false);
					// toast.dismiss(reservation.task.sid);
					setActiveReservation(undefined);
				} catch (error) {
					console.error('No call pending', error);
				}
			});

			r.on('wrapup', async (reservation) => {
				console.log('Wrapping up');
				removeReservation(reservation);
				currentCallControl?.ring(false);
				currentCallControl?.offHook(false);
				// toast.custom(() => <TaskWrapup />, { id: reservation.task.sid });
			});

			r.on('completed', async (reservation) => {
				addReservation(reservation);
				setActiveReservation(reservation);
				currentCallControl?.ring(false);
				currentCallControl?.offHook(false);
				// toast.dismiss(reservation.task.sid);
			});

			r.on('timeout', async (reservation) => {
				try {
					removeReservation(reservation);
					currentCallControl?.ring(false);
					setActiveReservation(undefined);
					// toast.dismiss(reservation.task.sid);
				} catch (error) {
					console.error('No call pending', error);
				}
			});
		} catch (error) {
			console.error(error);
		}
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
	// 	if (!worker) return;
	// }, [worker]);

	useEffect(() => {
		if (!currentCallControl || !activeReservation) return;
		currentCallControl?.deviceSignals.subscribe(async (d) => {
			if (d.type === SignalType.HOOK_SWITCH) {
				console.log(activeReservation);
				await activeReservation?.conference({
					beep: false,
					endConferenceOnExit: true,
					endConferenceOnCustomerExit: true,
				});

				// toast.custom(
				// 	() => (
				// 		<ActiveCall
				// 			taskSid={reservation.task.sid}
				// 			attributes={reservation.task.attributes}
				// 			conferenceSid={reservation.task.attributes?.conference?.sid ?? ''}
				// 		/>
				// 	),
				// 	{
				// 		duration: Infinity,
				// 		dismissible: false,
				// 		id: reservation.task.sid,
				// 	}
				// );
			}
		});
	}, [currentCallControl, activeReservation]);

	useEffect(() => {
		if (worker === undefined) return;
		worker?.on('ready', onWorkerReady);

		worker?.on('reservationCreated', onReservationCreated);

		return () => {
			worker?.off('ready', onWorkerReady);
			worker?.off('reservationCreated', onReservationCreated);
		};
	}, [worker]);

	return (
		<>
			{reservations.length > 0 && (
				<>
					<Separator />

					<section className='space-y-1.5 px-1.5'>
						{!isCollapsed && <h2 className='text-xs text-muted-foreground px-3 font-medium'>Tasks</h2>}

						{reservations.map((reservation, index) => (
							<TaskNotification
								key={reservation.sid}
								reservation={reservation}
								task={reservation.task}
							/>
						))}
					</section>
				</>
			)}
		</>
	);
};

export default TaskList;
