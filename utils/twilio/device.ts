import { Call, Device } from '@twilio/voice-sdk';
import { toast } from 'sonner';

export const selectOutputDevice = async (id: string, device: Device) => {
	try {
		console.log(`Audio Device: ${id} - selected`);
		await device.audio?.speakerDevices.set(id);
		await device.audio?.ringtoneDevices.set(id);
		console.log(`Twilio Device: ${id} successfully set`);
	} catch (error) {
		toast.error(`Error setting output device ${JSON.stringify(error)}`);
	}
};

export const selectInputDevice = async (id: string, device: Device) => {
	try {
		console.log(`Audio Device: ${id} - selected`);
		await device.audio?.setInputDevice(id);
		console.log(`Twilio Device: ${id} successfully set`);
	} catch (error) {
		toast.error(`Error setting input device ${JSON.stringify(error)}`);
	}
};

export const handleWarnings = (connection: Call) => {
	console.log('Phone: register connection handler');

	connection.on('warning', (name, data) => {
		if (name === 'low-mos') {
			// setError('low-mos');
		}
	});

	connection.on('warning-cleared', function (name) {
		if (name === 'low-mos') {
			// setError('low-mos');
		}
	});
};

export const toggleHold = (connection: Call) => {};
