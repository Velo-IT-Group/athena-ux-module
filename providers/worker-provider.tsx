'use client';
import { useContext, createContext, useEffect, useState, SetStateAction, Dispatch } from 'react';
import type { Call } from '@twilio/voice-sdk';

import { ConferenceInstance } from 'twilio/lib/rest/api/v2010/account/conference';
import { ActiveCall as CustomCall } from '@/components/active-call';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { Reservation, Worker } from 'twilio-taskrouter';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { activityState, deviceEligibleAtom, reservationsListState } from '@/atoms/twilioStateAtom';
import { toast } from 'sonner';
import TaskWrapup from '@/components/task/wrapup';
import { useDevice } from './device-provider';
import { useTask } from '@/components/active-call/context';

interface WorkerProviderProps {
	worker: Worker | undefined;
	reservations: Reservation[];
	setReservations: Dispatch<SetStateAction<Reservation[]>>;
}

const initialValues: WorkerProviderProps = {
	worker: undefined,
	reservations: [],
	setReservations: () => [],
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
	const [reservations, setReservations] = useState<Reservation[]>(initialValues.reservations);
	const deviceRegistration = useRecoilValue(deviceEligibleAtom);
	const { currentCallControl } = useDevice();
	const { setTask, setReservation } = useTask();

	const worker = new Worker(authToken, { closeExistingSessions: true });

	const onWorkerReady = async (w: Worker) => {
		console.log('Worker Ready', w.sid);
		// setActivity(w.activity);
		// 	// setActivityList(w.activities);
		const ress = Array.from(w.reservations.values());

		ress.forEach(async (res) => {
			switch (res.status) {
				case 'wrapping':
					setReservation(res);
					setTask(res.task);
					console.log(res.sid);
					toast.custom(() => <TaskWrapup />, {
						important: true,
						duration: res.timeout * 1000,
						id: res.task.sid,
					});
					break;
				default:
					setReservations((prev) => [...prev.filter((r) => r.sid !== res.sid), res]);
					if (res.task.taskChannelUniqueName === 'voice') {
						// currentCallControl?.signalIncomingCall();
					}
					break;
			}
		});
	};

	useEffect(() => {
		if (!worker || !deviceRegistration) return;

		worker?.on('ready', onWorkerReady);

		return () => {
			worker?.removeListener('ready', onWorkerReady);
		};
	}, [authToken, deviceRegistration]);

	return <Provider value={{ worker, reservations, setReservations }}>{children}</Provider>;
};

export const useWorker = () => {
	const state = useContext(context);

	return state;
};
