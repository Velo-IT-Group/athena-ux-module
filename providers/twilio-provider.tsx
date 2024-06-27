'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { type Reservation, Worker, Activity } from 'twilio-taskrouter';
import { Twilio } from 'twilio';
import { createAccessToken } from '@/lib/twilio';
import { useJabra } from './jabra-provider';
import { useRecoilState } from 'recoil';
import { reservationAtom } from '@/atoms/reservationAtom';
import { reject } from 'lodash';

interface TwilioProviderProps {
	reservations: Reservation[];
	worker: Worker | undefined;
	currentWorkspace: string | undefined;
	setCurrentWorkspace: React.Dispatch<React.SetStateAction<string | undefined>>;
	identity: string;
	client: Twilio | undefined;
	setIdentity: React.Dispatch<React.SetStateAction<string>>;
	activities: Activity[];
	setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
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
};

type WithChildProps = {
	accountSid?: string;
	authToken?: string;
	workspaceSid?: string;
	children: React.ReactNode;
};

const context = React.createContext(initialValues);
const { Provider } = context;

export const TwilioProvider = ({ authToken, workspaceSid, children }: WithChildProps) => {
	const [worker, setWorker] = useState<Worker>();
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [currentWorkspace, setCurrentWorkspace] = useState<string | undefined>(workspaceSid);
	const [activities, setActivities] = useState<Activity[]>([]);
	const [identity, setIdentity] = useState<string>('');

	const reservationsRef = useRef<Reservation[]>([]);
	reservationsRef.current = reservations;

	const username = process.env.NEXT_PUBLIC_API_KEY_SID;
	const password = process.env.NEXT_PUBLIC_API_KEY_SECRET;
	const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;

	const client = new Twilio(username, password, { accountSid });
	const { currentCallControl } = useJabra();

	useEffect(() => {
		if (!worker) {
			createAccessToken(
				process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID as string,
				process.env.NEXT_PUBLIC_API_KEY_SID as string,
				process.env.NEXT_PUBLIC_API_KEY_SECRET as string,
				process.env.NEXT_PUBLIC_WORKSPACE_SID as string,
				process.env.NEXT_PUBLIC_WORKER_SID as string
			).then((token) => {
				const w = new Worker(token, { closeExistingSessions: true });
				setWorker(w);
			});

			if (!worker) return;
		}

		worker.on('ready', (w) => {
			console.log(`Worker ${w.sid} is now ready for work`);
			setActivities(Array.from(w.activities.values()));
			console.log(Array.from(w.reservations.values()));
			const ress = Array.from(w.reservations.values());
			setReservations(ress);
			if (ress.length) {
				console.log(currentCallControl);
				currentCallControl?.signalIncomingCall();
			}
		});

		worker.on('reservationFailed', (r: Reservation) => {
			setReservations(reservations.filter((res) => res.sid !== r.sid));
		});

		worker?.on('reservationCreated', (r: Reservation) => {
			console.log(`Reservation ${r.sid} has been created for ${worker?.sid}`);

			currentCallControl?.signalIncomingCall();

			r.on('accepted', (reservation) => {
				console.log(`Reservation ${reservation.sid} was accepted.`);
				currentCallControl?.startCall();
				setReservations(reservations.filter((res) => res.sid !== reservation.sid));
			});

			r.on('rejected', (reservation) => {
				currentCallControl?.rejectIncomingCall();
				setReservations(reservations.filter((res) => res.sid !== reservation.sid));
			});

			r.on('timeout', (reservation) => {
				currentCallControl?.rejectIncomingCall();
				currentCallControl;
				setReservations(reservations.filter((res) => res.sid !== reservation.sid));
			});
		});

		return () => {
			worker?.removeAllListeners();
		};
	}, [worker, currentCallControl, reservations]);

	const values = {
		reservations: reservationsRef.current,
		worker,
		identity,
		client,
		currentWorkspace,
		setCurrentWorkspace,
		setIdentity,
		activities,
		setActivities,
	};

	return <Provider value={values}>{children}</Provider>;
};

export const useTwilio = () => {
	const state = useContext(context);

	return state;
};
