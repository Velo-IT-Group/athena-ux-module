'use client';
import { useContext, createContext } from 'react';
import type { Call } from '@twilio/voice-sdk';
import { ConferenceInstance } from 'twilio/lib/rest/api/v2010/account/conference';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { Worker, Supervisor, Workspace } from 'twilio-taskrouter';

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
	const worker = new Supervisor(authToken, { closeExistingSessions: true });

	return <Provider value={{ worker }}>{children}</Provider>;
};

export const useWorker = () => {
	const state = useContext(context);

	return state;
};
