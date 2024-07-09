import { useEffect, useRef, useState } from 'react';
import { useTwilio } from '@/providers/twilio-provider';
import { Call, Device } from '@twilio/voice-sdk';
import { ActiveCall } from '@/components/call-modal';
import { toast } from 'sonner';
import { getConferenceByName } from '@/lib/twilio/conference/helpers';
import { getConferenceParticipants } from '@/lib/twilio/voice/helpers';

const useDevice = (token: string) => {
	const { activeCall, setActiveCall } = useTwilio();

	const deviceRef = useRef(new Device(token));

	const [device, setDevice] = useState<Device>();

	useEffect(() => {
		const device = deviceRef.current;
		if (!device) return;

		if (device.state === Device.State.Unregistered) {
			device.register();
		}

		device.on('registered', (d) => {
			console.log('Twilio.Device Ready to make and receive calls!');
		});

		device.on('incoming', async (call: Call) => {
			console.log(`Incoming call from ${call.parameters.From}`);

			call.accept();

			// await currentCallControl?.signalIncomingCall();

			call.on('accept', async (c) => {
				console.log(call.parameters, c);

				// const conference = getConferenceParticipants();

				setActiveCall({ call });

				toast.custom(() => <ActiveCall activeCall={activeCall!} />, {
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
	}, []);

	useEffect(() => {
		if (!activeCall || !activeCall.task) return;
		// getConferenceByName(activeCall?.task?.sid).then((conference) => setActiveCall({ conference }));
	}, [activeCall]);

	return { device, setDevice };
};

export default useDevice;
