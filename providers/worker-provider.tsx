'use client';
import { useContext, createContext, useRef, useEffect } from 'react';
import type { Call } from '@twilio/voice-sdk';

import { ConferenceInstance } from 'twilio/lib/rest/api/v2010/account/conference';
import { ActiveCall as CustomCall } from '@/components/call-modal';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { Reservation, Worker } from 'twilio-taskrouter';
import { useJabra } from './jabra-provider';
import { toast } from 'sonner';
import TaskWrapup from '@/components/task/wrapup';
import IncomingCall from '@/components/incoming-call';

interface WorkerProviderProps {
	worker: Worker | undefined;
}

const initialValues: WorkerProviderProps = {
	worker: undefined,
};

type WithChildProps = {
	authToken: string;
	children: React.ReactNode;
};

const context = createContext(initialValues);
const { Provider } = context;

export type CustomCall = {
	call?: Call;
	conference?: ConferenceInstance;
	task?: TaskInstance;
};

export const WorkerProvider = ({ authToken, children }: WithChildProps) => {
	const workerRef = useRef(new Worker(authToken, { closeExistingSessions: true }));
	const { currentCallControl, deviceState } = useJabra();

	useEffect(() => {
		const worker = workerRef.current;

		console.log(worker);
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
								duration: res.timeout * 1000,
								id: res.task.attributes.call_sid,
							}
						);
						break;
					case 'pending':
						toast.custom(() => <IncomingCall reservation={res} />, {
							important: true,
							duration: res.timeout * 1000,
							id: res.task.attributes.call_sid,
						});

						currentCallControl?.signalIncomingCall(res.timeout * 1000);
					default:
						break;
				}
			});

			if (ress.length) {
				try {
					if (currentCallControl && !deviceState?.callActive) {
						console.log('running');
						await currentCallControl.signalIncomingCall(ress[0].timeout * 1000);
					}
				} catch (error) {
					console.log(error);
				}
			}
		});

		worker.on('error', (e) => {
			console.log('WORKER ERROR', e);
		});

		worker.on('reservationFailed', (r: Reservation) => {
			console.log('RESERVATION ERROR', r);
			toast.dismiss(r.task.attributes.call_sid);
		});

		worker.res;

		worker.on('reservationCreated', (r: Reservation) => {
			console.log('res made', r);
			try {
				console.log(`Reservation ${r.sid} has been created for ${worker?.sid}`);
				console.log(r.timeout * 1000);
				if (currentCallControl && !deviceState?.callActive) {
					currentCallControl.signalIncomingCall(r.timeout * 1000);
				}

				toast.custom(() => <IncomingCall reservation={r} />, {
					important: true,
					duration: r.task.timeout,
					id: r.task.attributes.call_sid,
				});

				r.on('accepted', async (reservation) => {
					console.log(`Reservation ${reservation.sid} was accepted.`);
					// await currentCallControl?.acceptIncomingCall();
					// setActiveCall({ task: reservation.task as unknown as TaskInstance });

					// currentCallControl?.startCall();
					// toast.dismiss(reservation.task.attributes.call_sid);
				});

				r.on('rejected', async (reservation) => {
					try {
						// currentCallControl?.rejectIncomingCall();
						toast.dismiss(reservation.task.attributes.call_sid);
					} catch (error) {
						console.error('No call pending', error);
					}
				});

				r.on('canceled', async (reservation) => {
					try {
						// currentCallControl?.rejectIncomingCall();
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
						// currentCallControl?.rejectIncomingCall();
						toast.dismiss(reservation.task.attributes.call_sid);
					} catch (error) {
						console.error('No call pending', error);
					}
				});
			} catch (error) {}
		});

		// return () => {
		// 	worker.removeAllListeners();
		// };
	}, [authToken]);

	return <Provider value={{ worker: workerRef.current }}>{children}</Provider>;
};

export const useWorker = () => {
	const state = useContext(context);

	return state;
};
