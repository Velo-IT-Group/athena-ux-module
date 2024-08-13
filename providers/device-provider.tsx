'use client';
import { useContext, createContext, useEffect, Dispatch, SetStateAction, useState, useRef } from 'react';
import { Device, type Call } from '@twilio/voice-sdk';
import { ConferenceInstance } from 'twilio/lib/rest/api/v2010/account/conference';
import { ActiveCall } from '@/components/active-call';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { toast } from 'sonner';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { callStateAtom, deviceEligibleAtom } from '@/atoms/twilioStateAtom';

interface DeviceProviderProps {
	device: Device | undefined;
	setDevice: Dispatch<SetStateAction<Device | undefined>>;
	hasExternalFunctionality: boolean;
	activeCalls: Call[];
	setActiveCalls: Dispatch<SetStateAction<Call[]>>;
}

const initialValues: DeviceProviderProps = {
	device: undefined,
	setDevice: () => undefined,
	hasExternalFunctionality: false,
	activeCalls: [],
	setActiveCalls: () => [],
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
	// const [activeCall, setActiveCall] = useRecoilState(callStateAtom);
	const [activeCalls, setActiveCalls] = useState<Call[]>([]);
	const setDeviceRegistration = useSetRecoilState(deviceEligibleAtom);
	const device = new Device(authToken, {
		disableAudioContextSounds: true,
		enableImprovedSignalingErrorPrecision: true,
		// logLevel: 1,
	});
	// let device = new Device(authToken, {
	// 	disableAudioContextSounds: true,
	// 	enableImprovedSignalingErrorPrecision: true,
	// });

	useEffect(() => {
		if (!device) return;

		if (device.state === Device.State.Unregistered) {
			device?.register();
		}

		device.on('registered', async (d) => {
			console.log('Twilio.Device Ready to make and receive calls!');
			setDeviceRegistration(true);

			// setActiveCall((prev) => {
			// 	return { ...prev, call };
			// });
		});

		device.on('error', (error) => {
			console.error(error);
			setDeviceRegistration(false);
		});

		device.on('incoming', (call: Call) => {
			console.log(`Incoming call from ${call.parameters.From}`);

			call.accept();

			call.on('accept', (c: Call) => {
				setActiveCalls((prev) => [...prev.filter((res) => res.parameters.CallSid !== c.parameters.CallSid), c]);
				console.log(c);
			});

			call.on('disconnect', (c: Call) => {
				setActiveCalls((prev) => [...prev.filter((call) => call.parameters.CallSid !== c.parameters.CallSid)]);
			});
		});

		return () => {
			device.removeAllListeners();
			if (device.state === Device.State.Registered) {
				device.unregister();
			}
		};
	}, [device]);

	useEffect(() => {
		if (!device.calls.length) return;
	}, [device.calls]);

	return (
		<Provider
			value={{
				device,
				setDevice: () => undefined,
				hasExternalFunctionality: device?.identity === '',
				activeCalls,
				setActiveCalls,
			}}
		>
			{children}
		</Provider>
	);
};

export const useDevice = () => {
	const state = useContext(context);

	return state;
};
