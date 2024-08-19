'use client';
import { useContext, useState, Dispatch, createContext, useRef } from 'react';
interface TwilioProviderProps {
	currentWorkspace: string | undefined;
	setCurrentWorkspace: Dispatch<React.SetStateAction<string | undefined>>;
	token: string;
}

const initialValues: TwilioProviderProps = {
	currentWorkspace: '',
	setCurrentWorkspace: () => undefined,
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
