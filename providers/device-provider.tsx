'use client';
import { useContext, createContext, useEffect, Dispatch, SetStateAction, useState, useRef, act, useMemo } from 'react';
import { Device, type Call } from '@twilio/voice-sdk';
import { ConferenceInstance } from 'twilio/lib/rest/api/v2010/account/conference';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { initalizeJabra } from '@/lib/jabra';
import { CallControlFactory, ICallControl, SignalType } from '@gnaudio/jabra-js';
import { toast } from 'sonner';
import { PreflightTestReport } from '@/types/twilio';

interface DeviceProviderProps {
	device: Device | undefined;
	setDevice: Dispatch<SetStateAction<Device | undefined>>;
	hasExternalFunctionality: boolean;
	activeCalls: Call[];
	setActiveCalls: Dispatch<SetStateAction<Call[]>>;
	activeCall: Call | undefined;
	setActiveCall: Dispatch<SetStateAction<Call | undefined>>;
	currentCallControl: ICallControl | undefined;
	setCurrentCallControl: Dispatch<SetStateAction<ICallControl | undefined>>;
	muted: boolean;
	setMuted: Dispatch<SetStateAction<boolean>>;
	testDevice: () => void;
}

const initialValues: DeviceProviderProps = {
	device: undefined,
	setDevice: () => undefined,
	hasExternalFunctionality: false,
	activeCalls: [],
	setActiveCalls: () => [],
	activeCall: undefined,
	setActiveCall: () => undefined,
	currentCallControl: undefined,
	setCurrentCallControl: () => undefined,
	muted: true,
	setMuted: () => false,
	testDevice: () => undefined,
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
	const [device, setDevice] = useState<Device>();
	const [currentCallControl, setCurrentCallControl] = useState<ICallControl | undefined>();
	const [activeCalls, setActiveCalls] = useState<Call[]>([]);
	const [muted, setMuted] = useState(false);
	const [activeCall, setActiveCall] = useState<Call | undefined>(initialValues.activeCall);

	useEffect(() => {
		if (!authToken || !window) return;
		setDevice(
			new Device(authToken, {
				disableAudioContextSounds: true,
				enableImprovedSignalingErrorPrecision: true,
				// logLevel: 1,
			})
		);
	}, [authToken]);

	useEffect(() => {
		if (!device) return;

		device.audio?.incoming(false);

		if (device.state === Device.State.Unregistered) {
			device?.register();
		}

		device.on('registered', async (d) => {
			console.log('Twilio.Device Ready to make and receive calls!');
			// setDeviceRegistration(true);

			// setActiveCall((prev) => {
			// 	return { ...prev, call };
			// });
		});

		device.on('error', (error) => {
			console.error(error);
			// setDeviceRegistration(false);
		});

		device.on('incoming', (call: Call) => {
			console.log(`Incoming call from ${call.parameters.From}`);

			call.accept();

			call.on('accept', (c: Call) => {
				setActiveCalls((prev) => [...prev.filter((res) => res.parameters.CallSid !== c.parameters.CallSid), c]);
				setActiveCall(call);
				currentCallControl?.offHook(true);
				console.log(c);
			});

			call.on('disconnect', (c: Call) => {
				setActiveCalls((prev) => [...prev.filter((call) => call.parameters.CallSid !== c.parameters.CallSid)]);
				setActiveCall(undefined);
				currentCallControl?.offHook(false);
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
		setMuted(muted);
		currentCallControl?.mute(muted);
		if (!activeCall) return;
		activeCall.mute(muted);
	}, [muted]);

	useEffect(() => {
		initalizeJabra()
			.then((j) => {
				const eccFactory = new CallControlFactory(j);

				j.deviceAdded.subscribe(async (d) => {
					if (!eccFactory.supportsCallControl(d)) {
						return;
					}
					// Convert the ISdkDevice to a ICallControlDevice
					const ccDevice = await eccFactory.createCallControl(d);

					try {
						const isLocked = await ccDevice.takeCallLock();
						if (!isLocked) throw new Error('Error getting lock');
						setCurrentCallControl(ccDevice);
					} catch (error) {
						toast.error('Call lock already established.');
					}
				});
			})
			.catch((e) => {
				console.error(e);
				toast.error(e);
			});

		return () => {
			if (currentCallControl) {
				currentCallControl.releaseCallLock();
			}
		};
	}, []);

	useEffect(() => {
		if (!currentCallControl) return;

		currentCallControl.deviceSignals.subscribe((signal) => {
			if (signal.type === SignalType.PHONE_MUTE) {
				setMuted((prev) => !prev);
			}
		});
	}, [currentCallControl]);

	const testDevice = () => {
		if (!window) return;
		const preflightTest = Device.runPreflight(authToken, { fakeMicInput: true });

		preflightTest.on('completed', (report: PreflightTestReport) => {
			report.warnings.forEach((warning) => toast.warning(warning.name));
			toast.success('Test successful');
		});

		preflightTest.on('failed', (error) => {
			toast.error(error);
		});
	};

	return (
		<Provider
			value={{
				device,
				setDevice: () => undefined,
				hasExternalFunctionality: device?.identity === '',
				activeCalls,
				setActiveCalls,
				activeCall,
				setActiveCall,
				currentCallControl,
				setCurrentCallControl,
				muted,
				setMuted,
				testDevice,
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
