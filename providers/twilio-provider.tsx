'use client';
import { useContext, useState, Dispatch, createContext, useRef } from 'react';
import { Workspace } from 'twilio-taskrouter';
interface TwilioProviderProps {
	currentWorkspace: string | undefined;
	setCurrentWorkspace: Dispatch<React.SetStateAction<string | undefined>>;
	token: string;
	workspace: Workspace | undefined;
}

const initialValues: TwilioProviderProps = {
	currentWorkspace: '',
	setCurrentWorkspace: () => undefined,
	token: '',
	workspace: undefined,
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
	const [currentWorkspace, setCurrentWorkspace] = useState<string | undefined>(workspaceSid);
	const workspace = new Workspace(authToken, {}, currentWorkspace);

	const values = {
		currentWorkspace,
		setCurrentWorkspace,
		token: authToken,
		workspace,
	};

	return <Provider value={values}>{children}</Provider>;
};

export const useTwilio = () => {
	const state = useContext(context);

	return state;
};
