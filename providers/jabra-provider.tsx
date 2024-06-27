'use client';
import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { EasyCallControlFactory, IApi, type ISingleCallControl, type MuteState } from '@gnaudio/jabra-js';
import { jabraStateAtom } from '@/atoms/jabraAtom';
import { initalizeJabra } from '@/lib/jabra';

interface JabraProviderProps {
	jabra: IApi | undefined;
	callControlDevices: ISingleCallControl[];
	setCallControlDevices: React.Dispatch<React.SetStateAction<ISingleCallControl[]>>;
	currentCallControl: ISingleCallControl | undefined;
	setCurrentCallControl: React.Dispatch<React.SetStateAction<ISingleCallControl | undefined>>;
}

const initialValues: JabraProviderProps = {
	jabra: undefined,
	callControlDevices: [],
	setCallControlDevices: () => undefined,
	currentCallControl: undefined,
	setCurrentCallControl: () => undefined,
};

type WithChildProps = {
	children: ReactNode;
};

export type DeviceState = {
	callActive: boolean;
	muteState: MuteState;
};

const context = React.createContext(initialValues);
const { Provider } = context;

export const JabraProvider = ({ children }: WithChildProps) => {
	const [jabra, setJabra] = useState<IApi>();
	const [callControlDevices, setCallControlDevices] = useState<ISingleCallControl[]>([]);
	const [currentCallControl, setCurrentCallControl] = useState<ISingleCallControl>();
	const ref = useRef<IApi | undefined>(undefined);
	const callControlRef = useRef<ISingleCallControl | undefined>(undefined);
	const callControlList = useRef<ISingleCallControl[]>([]);
	ref.current = jabra;
	callControlRef.current = currentCallControl;
	callControlList.current = callControlDevices;

	useEffect(() => {
		initalizeJabra()
			.then((j) => {
				setJabra(j);
				const eccFactory = new EasyCallControlFactory(j);

				j.deviceAdded.subscribe(async (d) => {
					if (!eccFactory.supportsEasyCallControl(d)) {
						return;
					}

					console.log(d);

					// Convert the ISdkDevice to a ICallControlDevice
					const ccDevice = await eccFactory.createSingleCallControl(d);
					setCurrentCallControl(ccDevice);
					setCallControlDevices((prev) => [...prev, ccDevice]);
				});
			})
			.catch((e) => console.log(e));
	}, []);

	const value = {
		jabra: ref.current || undefined,
		callControlDevices,
		setCallControlDevices,
		currentCallControl: callControlRef.current,
		setCurrentCallControl,
	};

	return <Provider value={value}>{children}</Provider>;
};

export const useJabra = () => {
	const state = useContext(context);

	return state;
};
