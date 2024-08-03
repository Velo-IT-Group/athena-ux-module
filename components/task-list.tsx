'use client';
import React, { useEffect } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWorker } from '@/providers/worker-provider';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import IncomingTask from './incoming-call';
import type { Reservation } from 'twilio-taskrouter';
import TaskWrapup from './task/wrapup';
import { toast } from 'sonner';
import { useRecoilState, useRecoilValue } from 'recoil';
import { callStateAtom, deviceEligibleAtom } from '@/atoms/twilioStateAtom';
import { reservationsListState } from '@/atoms/twilioStateAtom';
import { useDevice } from '@/providers/device-provider';

type Props = {
	className?: String;
};

const TaskList = ({ className }: Props) => {
	const [activeCall, setActiveCall] = useRecoilState(callStateAtom);
	const deviceRegistration = useRecoilValue(deviceEligibleAtom);
	const { device } = useDevice();
	const [reservations, setReservations] = useRecoilState(reservationsListState);
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
			await r.conference({ beep: false });

			// if (r.task.attributes.direction === 'outboundDial') {
			// 	const res = await r.conference({ beep: false });
			// 	console.log(res.task);
			// 	setActiveCall({ ...activeCall, task: res.task });
			// }

			r.on('accepted', async (reservation) => {
				setActiveCall({ ...activeCall, task: reservation.task });
				setReservations((prev) => [...prev.filter((res) => res.sid !== r.sid), r]);

				console.log(`Reservation ${reservation.sid} was accepted.`);
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
					toast.dismiss(reservation.task.attributes.call_sid);
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
				toast.dismiss(reservation.task.attributes.call_sid);
			});

			r.on('timeout', async (reservation) => {
				try {
					setReservations((prev) => prev.filter((r) => r.sid !== reservation.sid));
					toast.dismiss(reservation.task.attributes.call_sid);
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

		// device.on('incoming', async (call: Call) => {
		// 	console.log(`Incoming call from ${call.parameters.From}`);

		// 	call.on('accept', async (c) => {
		// 		setActiveCall((prev) => {
		// 			return { ...prev, call };
		// 		});

		// toast.custom(() => <ActiveCall />, {
		// 	duration: Infinity,
		// 	dismissible: false,
		// 	id: call.parameters.CallSid,
		// });
		// 	});
		// });

		// return () => {
		// 	worker?.removeListener('reservationCreated', onReservationCreated);
		// };
	}, [worker]);

	return (
		<>
			{reservations.length > 0 && (
				<section className='space-y-1.5 px-1.5'>
					<h2 className='text-xs text-muted-foreground px-3 font-medium'>Tasks</h2>

					<Popover open={true}>
						<div className='flex flex-col gap-1.5'>
							{reservations.map((reservation) => {
								const { attributes } = reservation.task;

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
											<IncomingTask reservation={reservation} />
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
