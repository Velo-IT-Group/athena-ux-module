'use client';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import {
	init,
	TransportContext,
	EasyCallControlFactory,
	MuteState,
} from '../node_modules/@gnaudio/jabra-js/browser-esm/index.js';
import type { ISingleCallControl, IConfig } from '@gnaudio/jabra-js';

interface JabraProviderProps {
	callControlDevices: ISingleCallControl[];
	currentCallControl: ISingleCallControl | undefined;
	setCurrentCallControl: React.Dispatch<React.SetStateAction<ISingleCallControl | undefined>>;
	deviceState: DeviceState;
}

const initialValues: JabraProviderProps = {
	callControlDevices: [],
	currentCallControl: undefined,
	setCurrentCallControl: () => undefined,
	deviceState: {
		callActive: false,
		muteState: MuteState.NO_ONGOING_CALLS,
	},
};

type WithChildProps = {
	children: ReactNode;
};

type DeviceState = {
	callActive: boolean;
	muteState: MuteState;
};

const context = React.createContext(initialValues);
const { Provider } = context;

export const JabraProvider = ({ children }: WithChildProps) => {
	const [callControlDevices, setCallControlDevices] = useState<ISingleCallControl[]>([]);
	const [currentCallControl, setCurrentCallControl] = useState<ISingleCallControl>();
	const [deviceState, setDeviceState] = useState<DeviceState>({
		callActive: false,
		muteState: MuteState.NO_ONGOING_CALLS,
	});

	useEffect(() => {
		const config = {
			partnerKey: '',
			appId: 'demo-app',
			appName: 'Demo App',
			transport: 'web-hid',
		} as IConfig;

		init(config)
			.then((jabra) => {
				const eccFactory = new EasyCallControlFactory(jabra);

				/**
				 * Subscribe to device attach events
				 */
				jabra.deviceAdded.subscribe(async (d) => {
					// Skip devices that do not support call control
					if (!eccFactory.supportsEasyCallControl(d)) {
						return;
					}

					// Convert the ISdkDevice to a ICallControlDevice
					const ccDevice = await eccFactory.createSingleCallControl(d);
					setCallControlDevices((defaultValue) => [...defaultValue, ccDevice]);
				});

				/**
				 * Subscribe to device detach events
				 */
				jabra.deviceRemoved.subscribe((removed) => {
					setCallControlDevices((prev) => [...prev].filter((x) => x.device.id !== removed.id));
				});
			})
			.catch((e) => console.error(e));
	}, []);

	useEffect(() => {
		if (!currentCallControl) return;
		// setCurrentCallControl(currentCallControl);
		const muteSubscription = currentCallControl.muteState.subscribe((muteState) => {
			console.log(muteState);
			setDeviceState((prevDeviceState) => {
				return { ...prevDeviceState, muteState };
			});
		});

		const callSubscription = currentCallControl.callActive.subscribe((callActive) => {
			setDeviceState((prevDeviceState) => {
				return { ...prevDeviceState, callActive };
			});
		});

		return () => {
			muteSubscription?.unsubscribe();
			callSubscription?.unsubscribe();
		};
	}, [currentCallControl]);

	return (
		<Provider value={{ callControlDevices, currentCallControl, setCurrentCallControl, deviceState }}>
			{children}
		</Provider>
	);
};

export const useJabra = () => {
	const state = useContext(context);

	return state;
};
