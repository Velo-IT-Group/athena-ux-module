'use client';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { EasyCallControlFactory, IApi, ISingleCallControl } from '@gnaudio/jabra-js';
import { initalizeJabra } from '@/lib/jabra';

const initialValues = {
	// jabra: undefined,
};

type WithChildProps = {
	children: ReactNode;
};

const context = React.createContext(initialValues);
const { Provider } = context;

export const JabraProvider = ({ children }: WithChildProps) => {
	const [currentCallControl, setCurrentCallControl] = useState<ISingleCallControl | undefined>();

	useEffect(() => {
		initalizeJabra()
			.then((j) => {
				const eccFactory = new EasyCallControlFactory(j);

				j.deviceAdded.subscribe(async (d) => {
					if (!eccFactory.supportsEasyCallControl(d)) {
						return;
					}

					// Convert the ISdkDevice to a ICallControlDevice
					const ccDevice = await eccFactory.createSingleCallControl(d);
					setCurrentCallControl(ccDevice);
					// setCallControlDevices((prev) => [...prev, ccDevice]);
				});
			})
			.catch((e) => console.log(e));
	}, []);

	useEffect(() => {
		if (!currentCallControl) return;
		// currentCallControl.muteState?.subscribe((muteState) => {
		// 	console.log(`Mute state emitted: ${muteState}`);
		// 	setDeviceState((prev) => ({ ...prev, muteState }));
		// });

		// currentCallControl.ringState?.subscribe((ringState) => {
		// 	console.log(ringState);
		// });

		// currentCallControl?.callActive?.subscribe((callActive) => {
		// 	console.log(`Call state emitted: ${callActive}`);
		// 	setDeviceState((prev) => ({ ...prev, callActive }));
		// 	// state.deviceState.callActive = callActive;
		// 	// uiUpdateState();
		// });
	}, [currentCallControl]);

	return <Provider value={{}}>{children}</Provider>;
};

export const useJabra = () => {
	const state = useContext(context);

	return state;
};
