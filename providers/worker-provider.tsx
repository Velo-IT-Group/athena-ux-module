'use client';
import { useContext, createContext, useEffect } from 'react';
import type { Call } from '@twilio/voice-sdk';

import { ConferenceInstance } from 'twilio/lib/rest/api/v2010/account/conference';
import { ActiveCall as CustomCall } from '@/components/active-call';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { Worker } from 'twilio-taskrouter';
import { useSetRecoilState } from 'recoil';
import { activityState, reservationsListState } from '@/atoms/twilioStateAtom';
import { toast } from 'sonner';
import TaskWrapup from '@/components/task/wrapup';

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
	const setReservations = useSetRecoilState(reservationsListState);
	const setActivity = useSetRecoilState(activityState);
	// const setActivityList = useSetRecoilState(activityListState);
	const worker = new Worker(authToken, { closeExistingSessions: true });

	console.log(worker);

	useEffect(() => {
		if (!worker) return;

		worker?.on('activityUpdated', (w) => {
			console.log(w.activity.sid);
		});

		worker?.on('ready', (w) => {
			// 	console.log('ready', w);
			// setActivity(w.activity);
			// 	// setActivityList(w.activities);
			const ress = Array.from(w.reservations.values());
			ress.forEach((res) => {
				setReservations((prev) => [...prev.filter((r) => r.sid !== res.sid), res]);
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
						setReservations((prev) => [...prev, res]);
						break;
					default:
						break;
				}
			});
		});

		return () => {
			worker?.removeAllListeners();
		};
	}, [authToken]);

	return <Provider value={{ worker }}>{children}</Provider>;
};

export const useWorker = () => {
	const state = useContext(context);

	return state;
};
