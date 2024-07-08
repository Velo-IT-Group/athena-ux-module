'use client';
import { useContext, useState, Dispatch, createContext, useRef } from 'react';
import type { Call, Device } from '@twilio/voice-sdk';

import { ConferenceInstance } from 'twilio/lib/rest/api/v2010/account/conference';
import { ActiveCall as CustomCall } from '@/components/call-modal';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import useDevice from '@/hooks/useDevice';
import useWorker from '@/hooks/useWorker';
import { Worker } from 'twilio-taskrouter';
interface TwilioProviderProps {
	currentWorkspace: string | undefined;
	setCurrentWorkspace: Dispatch<React.SetStateAction<string | undefined>>;
	activeCall: CustomCall | undefined;
	setActiveCall: Dispatch<React.SetStateAction<CustomCall | undefined>>;
	token: string;
	worker: Worker | undefined;
	device: Device | undefined;
}

const initialValues: TwilioProviderProps = {
	currentWorkspace: '',
	setCurrentWorkspace: () => undefined,
	activeCall: undefined,
	setActiveCall: () => undefined,
	token: '',
	worker: undefined,
	device: undefined,
};

type WithChildProps = {
	accountSid?: string;
	authToken: string;
	workspaceSid?: string;
	children: React.ReactNode;
};

const context = createContext(initialValues);
const { Provider } = context;

export type CustomCall = {
	call?: Call;
	conference?: ConferenceInstance;
	task?: TaskInstance;
};

export const TwilioProvider = ({ authToken, workspaceSid, children }: WithChildProps) => {
	const tokenRef = useRef(authToken);
	const [activeCall, setActiveCall] = useState<CustomCall>();
	const [currentWorkspace, setCurrentWorkspace] = useState<string | undefined>(workspaceSid);
	const { device } = useDevice(authToken);
	const worker = useWorker(authToken);

	const values = {
		currentWorkspace,
		setCurrentWorkspace,
		activeCall,
		setActiveCall,
		token: tokenRef.current,
		device,
		worker,
	};

	return <Provider value={values}>{children}</Provider>;
};

export const useTwilio = () => {
	const state = useContext(context);

	return state;
};
