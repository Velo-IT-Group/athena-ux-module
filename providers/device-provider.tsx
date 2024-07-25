'use client';
import { useContext, createContext, useRef, useEffect, useState, Dispatch, SetStateAction } from 'react';
import { Device, type Call } from '@twilio/voice-sdk';

import { ConferenceInstance } from 'twilio/lib/rest/api/v2010/account/conference';
import { ActiveCall, ActiveCall as CustomCall } from '@/components/call-modal';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { toast } from 'sonner';
import { useTwilio } from './twilio-provider';
import { useJabra } from './jabra-provider';

interface DeviceProviderProps {
	device: Device | undefined;
	setDevice: Dispatch<SetStateAction<Device | undefined>>;
	hasExternalFunctionality: boolean;
}

const initialValues: DeviceProviderProps = {
	device: undefined,
	setDevice: () => undefined,
	hasExternalFunctionality: false,
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

export const DeviceProvider = ({ authToken, children }: WithChildProps) => {
	const { activeCall, setActiveCall } = useTwilio();

	const device = new Device(authToken, {
		disableAudioContextSounds: true,
		sounds: {
			incoming: undefined,
		},
		enableImprovedSignalingErrorPrecision: true,
	});

	useEffect(() => {
		if (!device || device.state === Device.State.Unregistered) return;

		device.on('registered', async (d) => {
			console.log('Twilio.Device Ready to make and receive calls!');
			// try {
			// 	await currentCallControl?.signalIncomingCall();
			// } catch (error) {
			// 	console.error(error);
			// }
		});

		device.on('error', (error) => {
			console.error(error);
		});

		device.on('incoming', async (call: Call) => {
			console.log(`Incoming call from ${call.parameters.From}`);

			// if (currentCallControl) {
			// 	currentCallControl.signalIncomingCall();
			// }

			call.accept();

			// await currentCallControl?.signalIncomingCall();

			call.on('accept', async (c) => {
				console.log(call.parameters, c);

				// await currentCallControl?.startCall();
				// const conference = getConferenceParticipants();

				// setActiveCall({ call });

				// toast.custom(() => <ActiveCall activeCall={activeCall!} />, {
				// 	duration: Infinity,
				// 	dismissible: false,
				// 	id: call.parameters.CallSid,
				// });
			});
		});

		return () => {
			device.removeAllListeners();
			if (device.state === Device.State.Registered) {
				device.unregister();
			}
		};
	}, []);

	useEffect(() => {
		if (!device) return;
		window.addEventListener('click', () => {
			if (device?.state === Device.State.Unregistered) {
				console.log('registering device');
				device?.register();
				// currentCallControl?.endCall();
			}
		});
	}, [device]);

	return (
		<Provider value={{ device, setDevice: () => undefined, hasExternalFunctionality: device?.identity === '' }}>
			{children}
		</Provider>
	);
};

export const useDevice = () => {
	const state = useContext(context);

	return state;
};
