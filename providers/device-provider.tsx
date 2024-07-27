'use client';
import { useContext, createContext, useEffect, Dispatch, SetStateAction } from 'react';
import { Device, type Call } from '@twilio/voice-sdk';
import { ConferenceInstance } from 'twilio/lib/rest/api/v2010/account/conference';
import { ActiveCall } from '@/components/active-call';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { toast } from 'sonner';
import { useSetRecoilState } from 'recoil';
import { callStateAtom } from '@/atoms/twilioStateAtom';

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
	const setActiveCall = useSetRecoilState(callStateAtom);

	const device = new Device(authToken, {
		disableAudioContextSounds: true,
		sounds: {
			incoming: undefined,
		},
		enableImprovedSignalingErrorPrecision: true,
	});

	useEffect(() => {
		if (!device) return;

		if (device.state === Device.State.Unregistered) {
			device?.register();
		}

		device.on('registered', async (d) => {
			console.log('Twilio.Device Ready to make and receive calls!');
		});

		device.on('error', (error) => {
			console.error(error);
		});

		device.on('incoming', async (call: Call) => {
			console.log(`Incoming call from ${call.parameters.From}`);

			call.accept();

			call.on('accept', async (c) => {
				setActiveCall((prev: CustomCall) => ({ ...prev, call: c }));

				toast.custom(() => <ActiveCall />, {
					duration: Infinity,
					dismissible: false,
					id: call.parameters.CallSid,
				});
			});
		});

		return () => {
			device.removeAllListeners();
			if (device.state === Device.State.Registered) {
				device.unregister();
			}
		};
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
