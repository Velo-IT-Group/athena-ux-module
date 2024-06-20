'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Reservation, Worker } from 'twilio-taskrouter';
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

export const TwilioProvider = ({ accountSid, authToken, workspaceSid, children }: WithChildProps) => {
	const [worker, setWorker] = useState<Worker>();
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [currentWorkspace, setCurrentWorkspace] = useState<string | undefined>(workspaceSid);
	const [identity, setIdentity] = useState<string>('');
	const ws = useRef<Worker | null>(null);
	const client = new Twilio(process.env.NEXT_PUBLIC_ACCOUNT_SID, process.env.NEXT_PUBLIC_AUTH_TOKEN);
	const { currentCallControl } = useJabra();

	useEffect(() => {
		if (!currentCallControl) return;

		if (ws.current === null) {
			const token = createAccessToken(
				process.env.NEXT_PUBLIC_ACCOUNT_SID as string,
				process.env.NEXT_PUBLIC_API_KEY_SID as string,
				process.env.NEXT_PUBLIC_API_KEY_SECRET as string,
				process.env.NEXT_PUBLIC_WORKSPACE_SID as string,
				process.env.NEXT_PUBLIC_WORKER_SID as string
			);

			if (!token) return;
			console.log(token);
			ws.current = new Worker(token, { closeExistingSessions: true });
		}

		console.log(ws.current);

		ws.current.on('error', (e) => {
			console.error(e);
		});

		ws.current.on('ready', (w) => {
			console.log(`Worker ${w.sid} is now ready for work`);
			// console.log(w.activitySid);
			console.log(currentCallControl);
			console.log(currentCallControl.device.id);
			currentCallControl?.signalIncomingCall();
		});

		// ws.current.

		ws.current?.on('reservationCreated', (reservation: Reservation) => {
			console.log(`Reservation ${reservation.sid} has been created for ${ws.current?.sid}`);

			currentCallControl?.signalIncomingCall();

			reservation.on('accepted', (acceptedReservation) => {
				console.log(`Reservation ${acceptedReservation.sid} was accepted.`);
				currentCallControl?.startCall();
				setReservations([...reservations.filter((res) => res.sid === acceptedReservation.sid)]);
			});
		});

		return () => {
			ws.current?.removeAllListeners();
		};
	}, [reservations, currentCallControl]);

	const values = {
		reservations,
		worker: ws.current ?? undefined,
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
