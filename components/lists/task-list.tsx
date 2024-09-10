'use client';
import { useEffect, useState } from 'react';
import { useWorker } from '@/providers/worker-provider';
import type { Reservation, Worker } from 'twilio-taskrouter';
import { useDevice } from '@/providers/device-provider';
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
				await r.conference({ beep: false });
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

	const testReservations: Reservation[] = [
		{
			sid: '1',
			status: 'accepted',
			task: {
				sid: '1',
				taskChannelUniqueName: 'voice',
				queueName: 'Test Queue',
				dateUpdated: new Date(),
				attributes: {
					direction: 'inbound',
					from: '+12345678901',
					name: 'Test Task',
					conference: {
						sid: '',
						participants: {
							worker: {
								sid: '1',
								friendlyName: 'Test Worker',
							},
							customer: {
								sid: '2',
								friendlyName: 'Test Customer',
							},
						},
					},
				},
			},
		},
	];

	return (
		<>
			{reservations.length > 0 && (
				<>
					<Separator />

					<section className='space-y-1.5 px-1.5'>
						{!isCollapsed && <h2 className='text-xs text-muted-foreground px-3 font-medium'>Tasks</h2>}

						{reservations.map((reservation) => (
							<TaskNotification
								key={reservation.sid}
								reservation={reservation}
								task={reservation.task}
								isCollapsed={isCollapsed}
							/>
						))}
					</section>
				</>
			)}
		</>
	);
};

export default TaskList;
