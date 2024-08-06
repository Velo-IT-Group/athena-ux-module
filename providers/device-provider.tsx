'use client';
import { useContext, createContext, useEffect, Dispatch, SetStateAction } from 'react';
import { Device, type Call } from '@twilio/voice-sdk';
import { ConferenceInstance } from 'twilio/lib/rest/api/v2010/account/conference';
import { ActiveCall } from '@/components/active-call';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { toast } from 'sonner';
import { useSetRecoilState } from 'recoil';
import { callStateAtom, deviceEligibleAtom } from '@/atoms/twilioStateAtom';

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
	const setDeviceRegistration = useSetRecoilState(deviceEligibleAtom);

	const device = new Device(authToken, {
		disableAudioContextSounds: true,
		enableImprovedSignalingErrorPrecision: true,
	});

	const registerConnectionHandler = (connection: Call) => {
		console.log('Phone: register connection handler');

		connection.on('warning', (name, data) => {
			if (name === 'low-mos') {
			}
		});

		connection.on('warning-cleared', function (name) {
			if (name === 'low-mos') {
			}
		});
	};

	useEffect(() => {
		if (!device) return;

		if (device.state === Device.State.Unregistered) {
			device?.register();
		}

		device.on('registered', async (d) => {
			console.log('Twilio.Device Ready to make and receive calls!');
			setDeviceRegistration(true);
		});

		device.on('error', (error) => {
			console.error(error);
			setDeviceRegistration(false);
		});

		device.on('incoming', async (call: Call) => {
			console.log(`Incoming call from ${call.parameters.From}`);

			call.accept();

			// toast.custom(
			// 	() => (
			// 		<IncomingCallTest
			// 			toastId={call.parameters.CallSid}
			// 			r={call}
			// 		/>
			// 	),
			// 	{
			// 		duration: Infinity,
			// 		dismissible: false,
			// 		id: call.parameters.CallSid,
			// 	}
			// );

			call.on('accept', async (c) => {
				setActiveCall((prev) => {
					return { ...prev, call: c };
				});

				// toast.custom(() => <ActiveCall />, {
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
