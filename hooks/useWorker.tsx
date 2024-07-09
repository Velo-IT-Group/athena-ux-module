import IncomingCall from '@/components/incoming-call';
import TaskWrapup from '@/components/task/wrapup';
import { useJabra } from '@/providers/jabra-provider';
import { useTwilio } from '@/providers/twilio-provider';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { type Reservation, Worker } from 'twilio-taskrouter';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';

const useWorker = (token: string) => {
	const { setActiveCall } = useTwilio();
	const workerRef = useRef(new Worker(token, { closeExistingSessions: true }));
	const { currentCallControl } = useJabra();

	useEffect(() => {
		const worker = workerRef.current;
		if (!worker) return;

		worker.on('ready', async (w) => {
			console.log(`Worker ${w.sid} is now ready for work`);
			const ress = Array.from(w.reservations.values());
			ress.forEach((res) => {
				console.log(res.task.attributes.call_sid, res.task.attributes.callSid);
				switch (res.status) {
					case 'wrapping':
						toast.custom(
							() => (
								<TaskWrapup
									taskSid={res.task.sid}
									dateUpdated={res.dateUpdated}
								/>
							),
							{
								important: true,
								duration: Infinity,
								id: res.task.attributes.call_sid,
							}
						);
						break;
					case 'pending':
						toast.custom(() => <IncomingCall reservation={res} />, {
							important: true,
							id: res.task.attributes.call_sid,
						});
					default:
						break;
				}
			});

			if (ress.length) {
				try {
					await currentCallControl?.signalIncomingCall();
				} catch (error) {
					console.log(error);
				}
			}
		});

		worker.on('error', (e) => {
			console.log(e);
		});

		worker.on('reservationFailed', (r: Reservation) => {
			toast.dismiss(r.task.attributes.call_sid);
		});

		worker.on('reservationCreated', async (r: Reservation) => {
			console.log('CREATE RESERVATION');
			console.log(`Reservation ${r.sid} has been created for ${worker?.sid}`);
			// const isOutbound = r.task.attributes['direction'] === 'outboundDial';
			// if (isOutbound) {
			// 	await r.conference();
			// }

			toast.custom(() => <IncomingCall reservation={r} />, {
				important: true,
				duration: 18000,
				id: r.task.attributes.call_sid,
			});

			r.on('accepted', async (reservation) => {
				console.log(`Reservation ${reservation.sid} was accepted.`);
				setActiveCall({ task: reservation.task as unknown as TaskInstance });

				// currentCallControl?.startCall();
				// toast.dismiss(reservation.task.attributes.call_sid);
			});

			r.on('rejected', async (reservation) => {
				try {
					currentCallControl?.rejectIncomingCall();
					toast.dismiss(reservation.task.attributes.call_sid);
				} catch (error) {
					console.error('No call pending', error);
				}
			});

			r.on('canceled', async (reservation) => {
				try {
					currentCallControl?.rejectIncomingCall();
					toast.dismiss(reservation.task.attributes.call_sid);
				} catch (error) {
					console.error('No call pending', error);
				}
			});

			r.on('wrapup', async (reservation) => {
				const { task } = reservation;
				toast.custom(
					() => (
						<TaskWrapup
							dateUpdated={task.dateUpdated}
							taskSid={task.sid}
						/>
					),
					{ id: reservation.task.attributes.call_sid }
				);
			});

			r.on('completed', async (reservation) => {
				toast.dismiss(reservation.task.attributes.call_sid);
			});

			r.on('timeout', async (reservation) => {
				try {
					currentCallControl?.rejectIncomingCall();
					toast.dismiss(reservation.task.attributes.call_sid);
				} catch (error) {
					console.error('No call pending', error);
				}
			});
		});

		return () => {
			worker.removeAllListeners();
		};
	}, [currentCallControl, token]);

	return workerRef.current;
};

export default useWorker;
