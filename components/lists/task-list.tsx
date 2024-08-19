'use client';
import React, { useEffect, useState } from 'react';
import { useWorker } from '@/providers/worker-provider';
import IncomingTask from '../incoming-call';
import type { Reservation, Task } from 'twilio-taskrouter';
import TaskWrapup from '../task/wrapup';
import { toast } from 'sonner';
import { useRecoilValue } from 'recoil';
import { deviceEligibleAtom } from '@/atoms/twilioStateAtom';
import { useDevice } from '@/providers/device-provider';
import { getConferenceByName } from '@/lib/twilio/conference/helpers';
import { ActiveCall } from '../active-call';
import { SignalType } from '@gnaudio/jabra-js';
import { useTask } from '../active-call/context';

type Props = {
	isCollapsed?: boolean;
	className?: string;
};

const TaskList = ({ isCollapsed, className }: Props) => {
	const deviceRegistration = useRecoilValue(deviceEligibleAtom);
	const { device } = useDevice();
	const { reservations: defaultReservations, worker } = useWorker();
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [activeReservation, setActiveReservation] = useState<Reservation>();
	const [taskAttributes, setTaskAttributes] = useState<any[]>([]);
	const [tasks, setTasks] = useState<Task[]>([]);
	const { currentCallControl } = useDevice();
	const { setReservation, setTask } = useTask();

	useEffect(() => {
		if (!defaultReservations || !deviceRegistration) return;
		setReservations(defaultReservations);
	}, [defaultReservations, deviceRegistration]);

	const onReservationCreated = async (r: Reservation) => {
		if (!deviceRegistration) {
			try {
				return await r.reject();
			} catch (error) {
				return console.error(error);
			}
		}

		try {
			console.log(`Reservation ${r.sid} has been created for ${worker?.sid}`);
			setReservations((prev) => [...prev.filter((res) => res.sid !== r.sid), r]);
			setReservation(r);
			setTask(r.task);
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
				// setActiveCall({ ...activeCall, task: reservation.task });
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

				if (!reservation?.task?.attributes.conference) {
					setTimeout(async () => {
						const task = await reservation?.task?.fetchLatestVersion();
						console.log(task);
						setTask(task);
					}, 2000);
				}
			});

			r.on('rejected', async (reservation) => {
				try {
					setReservations((prev) => [...prev.filter((r) => r.sid !== reservation.sid)]);
					currentCallControl?.ring(false);
					setReservation(undefined);
					setTask(undefined);
				} catch (error) {
					console.error('No call pending', error);
				}
			});

			r.on('canceled', async (reservation) => {
				try {
					setReservations((prev) => [...prev.filter((r) => r.sid !== reservation.sid)]);
					currentCallControl?.ring(false);
					toast.dismiss(reservation.task.sid);
					setReservation(undefined);
					setTask(undefined);
				} catch (error) {
					console.error('No call pending', error);
				}
			});

			r.on('wrapup', async (reservation) => {
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
				setReservation(undefined);
				setTask(undefined);
			});

			r.on('timeout', async (reservation) => {
				try {
					setReservations((prev) => [...prev.filter((r) => r.sid !== reservation.sid)]);
					currentCallControl?.ring(false);
					toast.dismiss(reservation.task.sid);
					setReservation(undefined);
					setTask(undefined);
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
		if (!worker) return;

		worker.on('reservationFailed', (r: Reservation) => {
			console.error('failed res', r);
		});

		worker.on('reservationCreated', onReservationCreated);

		if (!device) return;
	}, [worker]);

	return (
		<>
			{reservations.length > 0 && (
				<section className='space-y-1.5 px-1.5'>
					{!isCollapsed && <h2 className='text-xs text-muted-foreground px-3 font-medium'>Tasks</h2>}

					{reservations.map((reservation) => (
						<IncomingTask
							key={reservation.sid}
							reservation={reservation}
							task={reservation.task}
							isCollapsed={isCollapsed}
						/>
					))}
				</section>
			)}
		</>
	);
};

export default TaskList;
