'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWorker } from '@/providers/worker-provider';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import IncomingTask from '../incoming-call';
import type { Reservation, Task, Worker } from 'twilio-taskrouter';
import TaskWrapup from '../task/wrapup';
import { toast, useSonner } from 'sonner';
import { useRecoilValue } from 'recoil';
import { deviceEligibleAtom } from '@/atoms/twilioStateAtom';
import { useDevice } from '@/providers/device-provider';
import { getConferenceByName } from '@/lib/twilio/conference/helpers';
import { ActiveCall } from '../active-call';
import { SignalType } from '@gnaudio/jabra-js';
import { useTask } from '../active-call/context';
import { Separator } from '../ui/separator';

type Props = {
	isCollapsed?: boolean;
	className?: string;
};

const TaskList = ({ isCollapsed, className }: Props) => {
	const { toasts } = useSonner();
	const { device, activeCall } = useDevice();
	const { worker } = useWorker();
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [activeReservation, setActiveReservation] = useState<Reservation>();
	const [taskAttributes, setTaskAttributes] = useState<any[]>([]);
	const [tasks, setTasks] = useState<Task[]>([]);
	const { currentCallControl, setMuted } = useDevice();
	const { setReservation, setTask } = useTask();

	const onWorkerReady = async (w: Worker) => {
		console.log('Worker Ready', w.sid);
		// setActivity(w.activity);
		// 	// setActivityList(w.activities);
		const ress = Array.from(w.reservations.values());
		console.log(ress);
		setReservations(ress);

		ress.forEach(async (res) => {
			switch (res.status) {
				case 'wrapping':
					setReservation(res);
					setTask(res.task);
					console.log(res.sid);
					toast.custom(() => <TaskWrapup />, {
						important: true,
						duration: res.timeout * 1000,
						id: res.task.sid,
					});
					break;
				default:
					setReservations((prev) => [...prev.filter((r) => r.sid !== res.sid), res]);
					if (res.task.taskChannelUniqueName === 'voice') {
						// currentCallControl?.signalIncomingCall();
					}
					break;
			}
		});
	};

	const onReservationCreated = async (r: Reservation) => {
		console.log(`Reservation ${r.sid} has been created for ${worker?.sid}`);
		try {
			setReservations((prev) => [...prev.filter((res) => res.sid !== r.sid), r]);
			setActiveReservation(r);

			if (r.task.attributes.direction === 'outboundDial') {
				const res = await r.conference({ beep: false });
				console.log(res.task);
				toast.custom(
					() => (
						<ActiveCall
							taskSid={r.task.sid}
							attributes={r.task.attributes}
							conferenceSid={r.task.attributes?.conference?.sid ?? ''}
						/>
					),
					{
						duration: Infinity,
						dismissible: false,
						important: true,
						id: r.task.sid,
					}
				);
				// setActiveCall({ ...activeCall, task: res.task });
			}

			if (currentCallControl && r.task.taskChannelUniqueName === 'voice') {
				try {
					currentCallControl?.ring(true);
				} catch (error) {
					console.log(error);
				}
			}

			r.on('accepted', async (reservation) => {
				console.log('Call accepted');
				// setActiveCall({ ...activeCall, task: reservation.task });
				try {
					currentCallControl?.ring(false);
				} catch (error) {
					console.error(error);
				}

				setReservations((prev) => [...prev.filter((r) => r.sid !== reservation.sid), reservation]);
				setTasks((prev) => [...prev.filter((res) => res.sid !== reservation.task.sid), reservation.task]);

				if (!reservation.task.attributes.conference) {
					const conferenceInfo = await getConferenceByName(reservation.task.sid);
					setTaskAttributes((prev) => [
						...prev.filter((item) => item.call_sid !== reservation.task.attributes.call_sid),
						{ ...reservation.task.attributes, conferenceInfo },
					]);
				} else {
					setTaskAttributes((prev) => [
						...prev.filter((item) => item.call_sid !== reservation.task.attributes.call_sid),
						reservation.task.attributes,
					]);
				}

				toast.custom(
					() => (
						<ActiveCall
							taskSid={reservation.task.sid}
							attributes={reservation.task.attributes}
							conferenceSid={reservation.task.attributes?.conference?.sid ?? ''}
						/>
					),
					{
						duration: Infinity,
						dismissible: false,
						id: reservation.task.sid,
					}
				);
			});

			r.on('rejected', async (reservation) => {
				try {
					setReservations((prev) => [...prev.filter((r) => r.sid !== reservation.sid)]);
					currentCallControl?.ring(false);
				} catch (error) {
					console.error('No call pending', error);
				}
			});

			r.on('canceled', async (reservation) => {
				try {
					setReservations((prev) => [...prev.filter((r) => r.sid !== reservation.sid)]);
					currentCallControl?.ring(false);
					toast.dismiss(reservation.task.sid);
				} catch (error) {
					console.error('No call pending', error);
				}
			});

			r.on('wrapup', async (reservation) => {
				console.log('Wrapping up');
				setReservations((prev) => [...prev.filter((r) => r.sid !== reservation.sid)]);
				currentCallControl?.ring(false);
				currentCallControl?.offHook(false);
				toast.custom(() => <TaskWrapup />, { id: reservation.task.sid });
			});

			r.on('completed', async (reservation) => {
				setReservations((prev) => [...prev.filter((r) => r.sid !== reservation.sid), reservation]);
				currentCallControl?.ring(false);
				currentCallControl?.offHook(false);
				toast.dismiss(reservation.task.sid);
			});

			r.on('timeout', async (reservation) => {
				try {
					setReservations((prev) => [...prev.filter((r) => r.sid !== reservation.sid)]);
					currentCallControl?.ring(false);
					toast.dismiss(reservation.task.sid);
				} catch (error) {
					console.error('No call pending', error);
				}
			});
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!currentCallControl) return;
		currentCallControl?.deviceSignals.subscribe(async (d) => {
			if (d.type === SignalType.HOOK_SWITCH && activeReservation) {
				// console.log(first)
				const reservation = await activeReservation.conference({
					beep: false,
					endConferenceOnExit: true,
					endConferenceOnCustomerExit: true,
				});

				toast.custom(
					() => (
						<ActiveCall
							taskSid={reservation.task.sid}
							attributes={reservation.task.attributes}
							conferenceSid={reservation.task.attributes?.conference?.sid ?? ''}
						/>
					),
					{
						duration: Infinity,
						dismissible: false,
						id: reservation.task.sid,
					}
				);
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
							<IncomingTask
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
