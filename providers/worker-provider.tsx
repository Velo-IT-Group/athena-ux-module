'use client';
import { useContext, createContext, useEffect, useState, useMemo } from 'react';
import type { Call } from '@twilio/voice-sdk';
import { ConferenceInstance } from 'twilio/lib/rest/api/v2010/account/conference';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { Worker, Supervisor, Activity } from 'twilio-taskrouter';

interface WorkerProviderProps {
	worker: Worker | undefined;
	activity: Activity | undefined;
}

const initialValues: WorkerProviderProps = {
	worker: undefined,
	activity: undefined,
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
	const [worker, setWorker] = useState<Worker>();
	const [activity, setActivity] = useState<Activity>();

	useEffect(() => {
		if (!authToken) return;
		const worker = new Supervisor(authToken);
		setWorker(worker);

		worker.on('activityUpdated', (w) => {
			console.log(w);
			setActivity(w.activity);
		});

		return () => {
			worker?.disconnect();
		};
	}, [authToken]);

	useEffect(() => {
		if (!worker || !worker.activity) return;
		setActivity(worker.activity);
	}, [worker, worker?.activity]);

	return <Provider value={{ worker, activity }}>{children}</Provider>;
};

export const useWorker = () => {
	const state = useContext(context);

	return state;
};
