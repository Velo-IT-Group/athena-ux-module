'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function useDevices() {
	const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

	useEffect(() => {
		if (!window || !navigator) return;
		navigator.mediaDevices
			.getUserMedia({ video: false, audio: true })
			.then((stream) => {
				// @ts-ignore
				window.localStream = stream; // A
				// @ts-ignore
				window.localAudio.srcObject = stream; // B
				// @ts-ignore
				window.localAudio.autoplay = true; // C
			})
			.catch((err) => {
				console.error(`you got an error: ${err}`);
				toast.error(err);
			});
		const getDevices = () => navigator.mediaDevices.enumerateDevices().then((newDevices) => setDevices(newDevices));
		navigator.mediaDevices.addEventListener('devicechange', getDevices);
		getDevices();

		return () => {
			navigator.mediaDevices.removeEventListener('devicechange', getDevices);
		};
	}, [window, navigator]);

	const audioInputDevices = devices.filter((device) => device.kind === 'audioinput');
	const audioOutputDevices = devices.filter((device) => device.kind === 'audiooutput');

	return {
		audioInputDevices,
		videoInputDevices: devices.filter((device) => device.kind === 'videoinput'),
		audioOutputDevices,
		defaultOutput: audioOutputDevices.find((d) => d.deviceId === 'Default'),
		defaultInput: audioInputDevices.find((d) => d.deviceId === 'Default'),
	};
}
