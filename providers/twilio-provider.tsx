'use client';
import { useContext, useState, Dispatch, createContext, useRef, MutableRefObject } from 'react';
import type { Call } from '@twilio/voice-sdk';

import { ConferenceInstance } from 'twilio/lib/rest/api/v2010/account/conference';
import { ActiveCall as CustomCall } from '@/components/active-call';
import { Task } from 'twilio-taskrouter';
interface TwilioProviderProps {
	currentWorkspace: string | undefined;
	setCurrentWorkspace: Dispatch<React.SetStateAction<string | undefined>>;
	activeCall: MutableRefObject<CustomCall | undefined>;
	// setActiveCall: Dispatch<React.SetStateAction<CustomCall | undefined>>;
	token: string;
}

const initialValues: TwilioProviderProps = {
	currentWorkspace: '',
	setCurrentWorkspace: () => undefined,
	activeCall: { current: undefined },
	// setActiveCall: () => undefined,
	token: '',
};

type WithChildProps = {
	accountSid?: string;
	authToken: string;
	workspaceSid?: string;
	children: React.ReactNode;
};

const context = createContext(initialValues);
const { Provider } = context;

export const TwilioProvider = ({ authToken, workspaceSid, children }: WithChildProps) => {
	const tokenRef = useRef(authToken);
	// const [activeCall, setActiveCall] = useState<CustomCall>();
	// const activeCallRef = useRef<CustomCall | undefined>(undefined);
	const [currentWorkspace, setCurrentWorkspace] = useState<string | undefined>(workspaceSid);

	const values = {
		currentWorkspace,
		setCurrentWorkspace,
		token: tokenRef.current,
	};

	return <Provider value={values}>{children}</Provider>;
};

export const useTwilio = () => {
	const state = useContext(context);

	return state;
};
