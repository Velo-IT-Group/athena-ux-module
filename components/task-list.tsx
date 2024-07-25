'use client';
import React, { useEffect, useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWorker } from '@/providers/worker-provider';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import IncomingTask from './incoming-call';
import type { Reservation, Task } from 'twilio-taskrouter';

type Props = {
	className?: String;
};

const TaskList = ({ className }: Props) => {
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [tasks, setTasks] = useState<Task[]>([]);
	const { worker } = useWorker();

	useEffect(() => {
		if (!worker) return;

		worker.on('activityUpdated', (w) => {
			console.log(w.activity.sid);
		});

		worker.on('ready', (w) => {
			const ress = Array.from(w.reservations.values());

			ress.forEach((res) => {
				setReservations((prev) => [...prev.filter((r) => r.sid !== res.sid), res]);
				switch (res.status) {
					case 'wrapping':
						// toast.custom(
						// 	() => (
						// 		<TaskWrapup
						// 			taskSid={res.task.sid}
						// 			dateUpdated={res.dateUpdated}
						// 		/>
						// 	),
						// 	{
						// 		important: true,
						// 		duration: res.timeout * 1000,
						// 		id: res.task.attributes.call_sid,
						// 	}
						// );
						break;
					case 'pending':
						setTasks((prev) => [...prev, res.task]);
						break;
					default:
						break;
				}
			});
		});

		worker.on('reservationFailed', (r: Reservation) => {
			console.error('failed res', r);
		});

		worker.on('reservationCreated', async (r: Reservation) => {
			setReservations((prev) => [...prev, r]);
			try {
				console.log(`Reservation ${r.sid} has been created for ${worker?.sid}`);

				if (r.task.attributes.direction === 'outboundDial') {
					await r.conference();
				}
				// toast.custom(() => <IncomingCall reservation={r} />, {
				// 	important: true,
				// 	duration: r.task.timeout,
				// 	id: r.task.attributes.call_sid,
				// });

				r.on('accepted', async (reservation) => {
					console.log(`Reservation ${reservation.sid} was accepted.`);
					setTasks((prev) => [...prev, reservation.task]);
					// await currentCallControl?.acceptIncomingCall();
					// setActiveCall({ task: reservation.task as unknown as TaskInstance });

					// currentCallControl?.startCall();
					// toast.dismiss(reservation.task.attributes.call_sid);
				});

				r.on('rejected', async (reservation) => {
					try {
						setReservations((prev) => prev.filter((r) => r.sid !== reservation.sid));
						// currentCallControl?.rejectIncomingCall();
						// toast.dismiss(reservation.task.attributes.call_sid);
					} catch (error) {
						console.error('No call pending', error);
					}
				});

				r.on('canceled', async (reservation) => {
					try {
						setReservations((prev) => prev.filter((r) => r.sid !== reservation.sid));
						// currentCallControl?.rejectIncomingCall();
						// toast.dismiss(reservation.task.attributes.call_sid);
					} catch (error) {
						console.error('No call pending', error);
					}
				});

				r.on('wrapup', async (reservation) => {
					const { task } = reservation;
					setTasks((prev) => prev.filter((t) => t.sid !== task.sid));
					// toast.custom(
					// 	() => (
					// 		<TaskWrapup
					// 			dateUpdated={task.dateUpdated}
					// 			taskSid={task.sid}
					// 		/>
					// 	),
					// 	{ id: reservation.task.attributes.call_sid }
					// );
				});

				r.on('completed', async (reservation) => {
					setTasks((prev) => prev.filter((t) => t.sid !== reservation.task.sid));
					setReservations((prev) => prev.filter((r) => r.sid !== reservation.sid));
					// toast.dismiss(reservation.task.attributes.call_sid);
				});

				r.on('timeout', async (reservation) => {
					try {
						setTasks((prev) => prev.filter((t) => t.sid !== reservation.task.sid));
						setReservations((prev) => prev.filter((r) => r.sid !== reservation.sid));
						// currentCallControl?.rejectIncomingCall();
						// toast.dismiss(reservation.task.attributes.call_sid);
					} catch (error) {
						console.error('No call pending', error);
					}
				});
			} catch (error) {}
		});

		return () => {
			worker.removeAllListeners();
		};
	}, [worker]);

	return (
		<>
			{tasks.length > 0 && (
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
