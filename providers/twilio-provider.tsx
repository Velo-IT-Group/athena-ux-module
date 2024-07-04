'use client';
import { useContext, useEffect, useRef, useState, Dispatch, createContext } from 'react';
import { type Reservation, Worker, Activity } from 'twilio-taskrouter';
import { Twilio } from 'twilio';
import { Device, Call } from '@twilio/voice-sdk';
import { createAccessToken } from '@/lib/twilio';
import { useJabra } from './jabra-provider';
import { ConferenceInstance } from 'twilio/lib/rest/api/v2010/account/conference';
import { ToastT, toast } from 'sonner';
import IncomingCall from '@/components/incoming-call';
import IncomingCallTest from '@/components/incoming-call-test';

interface TwilioProviderProps {
	reservations: Reservation[];
	worker: Worker | undefined;
	currentWorkspace: string | undefined;
	setCurrentWorkspace: Dispatch<React.SetStateAction<string | undefined>>;
	identity: string;
	client: Twilio | undefined;
	setIdentity: Dispatch<React.SetStateAction<string>>;
	activities: Activity[];
	setActivities: Dispatch<React.SetStateAction<Activity[]>>;
	activeCall: ActiveCall | undefined;
	setActiveCall: Dispatch<React.SetStateAction<ActiveCall | undefined>>;
}

const initialValues: TwilioProviderProps = {
	reservations: [],
	worker: undefined,
	identity: '',
	client: undefined,
	currentWorkspace: '',
	setCurrentWorkspace: () => undefined,
	setIdentity: () => undefined,
	activities: [],
	setActivities: () => undefined,
	activeCall: undefined,
	setActiveCall: () => undefined,
};

type WithChildProps = {
	accountSid?: string;
	authToken?: string;
	workspaceSid?: string;
	children: React.ReactNode;
};

const context = createContext(initialValues);
const { Provider } = context;

type ActiveCall = {
	call?: Call;
	conference?: ConferenceInstance;
};

export const TwilioProvider = ({ authToken, workspaceSid, children }: WithChildProps) => {
	const [device, setDevice] = useState<Device>();
	const [activeCall, setActiveCall] = useState<ActiveCall>();
	const [worker, setWorker] = useState<Worker>();
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [currentWorkspace, setCurrentWorkspace] = useState<string | undefined>(workspaceSid);
	const [activities, setActivities] = useState<Activity[]>([]);
	const [identity, setIdentity] = useState<string>('');
	const toasts = new Map<string, string | number>();

	const activitiesRef = useRef<Activity[]>([]);
	const reservationsRef = useRef<Reservation[]>([]);
	reservationsRef.current = reservations;
	activitiesRef.current = activities;

	const username = process.env.NEXT_PUBLIC_API_KEY_SID;
	const password = process.env.NEXT_PUBLIC_API_KEY_SECRET;
	const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;

	const client = new Twilio(username, password, { accountSid });
	const { currentCallControl } = useJabra();

	useEffect(() => {
		// if (!currentCallControl) return;

		if (!worker) {
			createAccessToken(
				process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID as string,
				process.env.NEXT_PUBLIC_API_KEY_SID as string,
				process.env.NEXT_PUBLIC_API_KEY_SECRET as string,
				process.env.NEXT_PUBLIC_WORKSPACE_SID as string,
				process.env.NEXT_PUBLIC_WORKER_SID as string
			).then((token) => {
				const w = new Worker(token, { closeExistingSessions: true });
				const d = new Device(token, { disableAudioContextSounds: true, enableImprovedSignalingErrorPrecision: true });
				console.log(token);
				d.register();
				setWorker(w);
				setDevice(d);
			});

			if (!worker) return;
			if (!device) return;
		}

		if (!device) return;

		device.on('registered', () => {
			console.log('Twilio.Device Ready to make and receive calls!');
		});

		device.on('incoming', async (call: Call) => {
			console.log(`Incoming call from ${call.parameters.From}`);

			call.accept({});

			// await currentCallControl?.signalIncomingCall();

			call.on('accept', () => {
				console.log('call accepted');
				try {
					currentCallControl?.startCall();
				} catch {
					currentCallControl?.endCall();
					currentCallControl?.startCall();
				}
				setActiveCall({ call });
			});

			call.on('', () => {});
		});

		worker.on('ready', async (w) => {
			console.log(`Worker ${w.sid} is now ready for work`);
			setActivities(Array.from(w.activities.values()));
			const ress = Array.from(w.reservations.values());
			ress.forEach((res) => {
				const t = toast.custom(
					(t) => (
						<IncomingCall
							reservation={res}
							toastId={t}
						/>
					),
					{ important: true, duration: 18000 }
				);
				toasts.set(res.sid, t);
			});
			// setReservations(ress);
			if (ress.length) {
				try {
					await currentCallControl?.signalIncomingCall();
				} catch (error) {
					console.log(error);
				}
			}
		});

		worker.on('reservationFailed', (r: Reservation) => {
			setReservations(reservations.filter((res) => res.sid !== r.sid));
			const t = toasts.get(r.sid);
			toast.dismiss(t);
			toasts.delete(r.sid);
		});

		worker?.on('reservationCreated', async (r: Reservation) => {
			console.log(`Reservation ${r.sid} has been created for ${worker?.sid}`);

			// setReservations((reservations) => [...reservations, r]);
			const t = toast.custom(
				(t) => (
					<IncomingCallTest
						r={r}
						toastId={t}
					/>
				),
				{ important: true, duration: 18000 }
			);
			toasts.set(r.sid, t);

			r.on('accepted', async (reservation) => {
				console.log(`Reservation ${reservation.sid} was accepted.`);

				// currentCallControl?.startCall();
				toast.dismiss(t);
				toasts.delete(r.sid);
				setReservations(reservations.filter((res) => res.sid !== reservation.sid));
			});

			r.on('rejected', async (reservation) => {
				try {
					currentCallControl?.rejectIncomingCall();
					toast.dismiss(t);
					toasts.delete(r.sid);
				} catch (error) {
					console.error('No call pending', error);
				}
				setReservations(reservations.filter((res) => res.sid !== reservation.sid));
			});

			r.on('canceled', async (reservation) => {
				try {
					// currentCallControl?.rejectIncomingCall();
					toast.dismiss(t);
					toasts.delete(r.sid);
				} catch (error) {
					console.error('No call pending', error);
				}
				setReservations(reservations.filter((res) => res.sid !== reservation.sid));
			});

			r.on('timeout', async (reservation) => {
				try {
					// currentCallControl?.rejectIncomingCall();
					toast.dismiss(t);
					toasts.delete(r.sid);
				} catch (error) {
					console.error('No call pending', error);
				}
				setReservations(reservations.filter((res) => res.sid !== reservation.sid));
			});
		});

		return () => {
			worker?.removeAllListeners();
			device?.removeAllListeners();
		};
	}, [worker, currentCallControl, reservations, device]);

	const values = {
		reservations: reservationsRef.current,
		worker,
		identity,
		client,
		currentWorkspace,
		setCurrentWorkspace,
		setIdentity,
		activities: activitiesRef.current,
		setActivities,
		activeCall,
		setActiveCall,
	};

	return <Provider value={values}>{children}</Provider>;
};

export const useTwilio = () => {
	const state = useContext(context);

	return state;
};
