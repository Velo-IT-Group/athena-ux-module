'use client';
import { useContext, useState, createContext, useRef } from 'react';
import { Workspace } from 'twilio-taskrouter';
interface TwilioProviderProps {
	workspace: Workspace | undefined;
	token: string;
}

const initialValues: TwilioProviderProps = {
	workspace: undefined,
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
	const workspace = new Workspace(authToken, {}, workspaceSid);

	const values = {
		workspace,
		token: authToken,
	};

	return <Provider value={values}>{children}</Provider>;
};

export const useTwilio = () => {
	const state = useContext(context);

	return state;
};
