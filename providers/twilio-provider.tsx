'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { type Reservation, Worker } from 'twilio-taskrouter';
import { Twilio } from 'twilio';
import { createAccessToken } from '@/lib/twilio';
import { useJabra } from './jabra-provider';

interface TwilioProviderProps {
	reservations: Reservation[];
	worker: Worker | undefined;
	currentWorkspace: string | undefined;
	setCurrentWorkspace: React.Dispatch<React.SetStateAction<string | undefined>>;
	identity: string;
	client: Twilio | undefined;
	setIdentity: React.Dispatch<React.SetStateAction<string>>;
}

const initialValues: TwilioProviderProps = {
	reservations: [],
	worker: undefined,
	identity: '',
	client: undefined,
	currentWorkspace: '',
	setCurrentWorkspace: () => undefined,
	setIdentity: () => undefined,
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
	const [identity, setIdentity] = useState<string>('');
	const workerRef = useRef<Worker | null>(null);

	const username = process.env.NEXT_PUBLIC_API_KEY_SID;
	const password = process.env.NEXT_PUBLIC_API_KEY_SECRET;
	const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;

	const client = new Twilio(username, password, { accountSid });
	const { currentCallControl } = useJabra();

	useEffect(() => {
		if (!currentCallControl) return;

		if (!worker) {
			createAccessToken(
				process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID as string,
				process.env.NEXT_PUBLIC_API_KEY_SID as string,
				process.env.NEXT_PUBLIC_API_KEY_SECRET as string,
				process.env.NEXT_PUBLIC_WORKSPACE_SID as string,
				process.env.NEXT_PUBLIC_WORKER_SID as string
			).then((token) => {
				setWorker(new Worker(token, { closeExistingSessions: true }));
			});

			if (!worker) return;
		}

		worker.on('error', (e) => {
			console.error(e);
		});

		worker.on('ready', (w) => {
			console.log(`Worker ${w.sid} is now ready for work`);
			// console.log(w.activitySid);
			console.log(currentCallControl);
			console.log(currentCallControl.device.id);
			currentCallControl?.signalIncomingCall();
		});

		// ws.current.

		worker?.on('reservationCreated', (reservation: Reservation) => {
			console.log(`Reservation ${reservation.sid} has been created for ${worker?.sid}`);

			currentCallControl?.signalIncomingCall();

			reservation.on('accepted', (acceptedReservation) => {
				console.log(`Reservation ${acceptedReservation.sid} was accepted.`);
				currentCallControl?.startCall();
				setReservations([...reservations.filter((res) => res.sid === acceptedReservation.sid)]);
			});
		});

		return () => {
			worker?.removeAllListeners();
		};
	}, [worker, reservations, currentCallControl]);

	const values = {
		reservations,
		worker,
		identity,
		client,
		currentWorkspace,
		setCurrentWorkspace,
		setIdentity,
	};

	return <Provider value={values}>{children}</Provider>;
};

export const useTwilio = () => {
	const state = useContext(context);

	return state;
};
