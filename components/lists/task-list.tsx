'use client';
import React, { useEffect } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWorker } from '@/providers/worker-provider';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import IncomingTask from '../incoming-call';
import type { Reservation, Task } from 'twilio-taskrouter';
import TaskWrapup from '../task/wrapup';
import { toast, useSonner } from 'sonner';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
	activeTaskAttributesListState,
	callStateAtom,
	deviceEligibleAtom,
	tasksListState,
} from '@/atoms/twilioStateAtom';
import { reservationsListState } from '@/atoms/twilioStateAtom';
import { useDevice } from '@/providers/device-provider';
import { getConferenceByName } from '@/lib/twilio/conference/helpers';
import { ActiveCall } from '../active-call';

type Props = {
	className?: String;
};

const TaskList = ({ className }: Props) => {
	const { toasts } = useSonner();
	const [activeCall, setActiveCall] = useRecoilState(callStateAtom);
	const deviceRegistration = useRecoilValue(deviceEligibleAtom);
	const { device } = useDevice();
	const [reservations, setReservations] = useRecoilState(reservationsListState);
	const [taskAttributes, setTaskAttributes] = useRecoilState(activeTaskAttributesListState);
	const [tasks, setTasks] = useRecoilState(tasksListState);
	const { worker } = useWorker();

	const onReservationCreated = async (r: Reservation) => {
		if (!deviceRegistration) {
			try {
				await r.reject();
			} catch (error) {
				console.error(error);
			}
			return;
		}

		try {
			console.log(`Reservation ${r.sid} has been created for ${worker?.sid}`);

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
						id: r.task.sid,
					}
				);
				// setActiveCall({ ...activeCall, task: res.task });
			}

			r.on('accepted', async (reservation) => {
				// setActiveCall({ ...activeCall, task: reservation.task });
				setReservations((prev) => [...prev.filter((res) => res.sid !== r.sid), r]);
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

				if (!toasts.some((toast) => toast.id === reservation.task.sid)) {
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

			r.on('rejected', async (reservation) => {
				try {
					setReservations((prev) => prev.filter((r) => r.sid !== reservation.sid));
				} catch (error) {
					console.error('No call pending', error);
				}
			});

			r.on('canceled', async (reservation) => {
				try {
					setReservations((prev) => prev.filter((r) => r.sid !== reservation.sid));
					toast.dismiss(reservation.task.sid);
				} catch (error) {
					console.error('No call pending', error);
				}
			});

			r.on('wrapup', async (reservation) => {
				setReservations((prev) => prev.filter((r) => r.sid !== reservation.sid));

				toast.custom(
					() => (
						<TaskWrapup
							dateUpdated={reservation.task.dateUpdated}
							taskSid={reservation.task.sid}
						/>
					),
					{ id: reservation.task.attributes.call_sid }
				);
			});

			r.on('completed', async (reservation) => {
				setReservations((prev) => prev.filter((r) => r.sid !== reservation.sid));
				toast.dismiss(reservation.task.sid);
			});

			r.on('timeout', async (reservation) => {
				try {
					setReservations((prev) => prev.filter((r) => r.sid !== reservation.sid));
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
					<h2 className='text-xs text-muted-foreground px-3 font-medium'>Tasks</h2>

					<Popover open={reservations.some((reservation) => reservation.status === 'pending')}>
						<div className='flex flex-col gap-1.5'>
							{reservations.map((reservation) => {
								const { attributes } = reservation.task;
								console.log(attributes.call_sid);

								return (
									<>
										<PopoverTrigger
											key={reservation.task.sid}
											className={cn(
												buttonVariants({ variant: 'ghost', size: 'sm' }),
												'w-full shrink overflow-hidden justify-start'
											)}
										>
											<span className='bg-muted rounded-sm h-8 w-8 grid place-items-center'>
												{reservation.task.taskChannelUniqueName === 'voice' && '📞'}
												{reservation.task.taskChannelUniqueName === 'chat' && '💬'}
												{reservation.task.taskChannelUniqueName === 'chat' && ''}
											</span>

											<h3 className='text-muted-foreground flex items-center gap-1.5 font-medium'>{attributes.name}</h3>
										</PopoverTrigger>

										<PopoverContent
											side='right'
											align='center'
											className='p-0'
										>
											<IncomingTask
												reservation={reservation}
												task={reservation.task}
											/>
										</PopoverContent>
									</>
								);
							})}
						</div>
					</Popover>
				</section>
			)}
		</>
	);
};

export default TaskList;
