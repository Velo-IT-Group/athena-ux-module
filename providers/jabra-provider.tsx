'use client';
import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { EasyCallControlFactory, IApi, MuteState, type ISingleCallControl } from '@gnaudio/jabra-js';
import { initalizeJabra } from '@/lib/jabra';

interface JabraProviderProps {
	jabra: IApi | undefined;
	callControlDevices: ISingleCallControl[];
	setCallControlDevices: React.Dispatch<React.SetStateAction<ISingleCallControl[]>>;
	currentCallControl: ISingleCallControl | undefined;
	setCurrentCallControl: React.Dispatch<React.SetStateAction<ISingleCallControl | undefined>>;
	deviceState: DeviceState | undefined;
	setDeviceState: React.Dispatch<React.SetStateAction<DeviceState>>;
}

const initialValues: JabraProviderProps = {
	jabra: undefined,
	callControlDevices: [],
	setCallControlDevices: () => undefined,
	currentCallControl: undefined,
	setCurrentCallControl: () => undefined,
	deviceState: undefined,
	setDeviceState: () => {
		return {
			callActive: false,
			muteState: MuteState.NO_ONGOING_CALLS,
		};
	},
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
	const [deviceState, setDeviceState] = useState<DeviceState>({
		callActive: false,
		muteState: MuteState.NO_ONGOING_CALLS,
	});
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
					console.log(d);
					if (!eccFactory.supportsEasyCallControl(d)) {
						return;
					}

					// Convert the ISdkDevice to a ICallControlDevice
					const ccDevice = await eccFactory.createSingleCallControl(d);
					setCurrentCallControl(ccDevice);
					setCallControlDevices((prev) => [...prev, ccDevice]);
				});
			})
			.catch((e) => console.log(e));
	}, []);

	useEffect(() => {
		if (!currentCallControl) return;
		currentCallControl.muteState.subscribe((muteState) => {
			console.log(`Mute state emitted: ${muteState}`);
			setDeviceState((prev) => ({ ...prev, muteState }));
		});

		currentCallControl.ringState.subscribe((ringState) => {
			console.log(ringState);
		});

		currentCallControl.callActive.subscribe((callActive) => {
			console.log(`Call state emitted: ${callActive}`);
			setDeviceState((prev) => ({ ...prev, callActive }));
			// state.deviceState.callActive = callActive;
			// uiUpdateState();
		});
	}, [currentCallControl]);

	const value = {
		jabra: ref.current || undefined,
		callControlDevices,
		setCallControlDevices,
		currentCallControl: callControlRef.current,
		setCurrentCallControl,
		deviceState,
		setDeviceState,
	};

	return <Provider value={value}>{children}</Provider>;
};

export const useJabra = () => {
	const state = useContext(context);

	return state;
};
