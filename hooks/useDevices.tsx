'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function useDevices() {
	const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

	useEffect(() => {
		if (!window || !navigator) return;
		const getDevices = () => navigator.mediaDevices.enumerateDevices().then((newDevices) => setDevices(newDevices));
		navigator.mediaDevices.addEventListener('devicechange', getDevices);
		getDevices();

		return () => {
			navigator.mediaDevices.removeEventListener('devicechange', getDevices);
		};
	}, [window, navigator]);

	const audioInputDevices = devices.filter((device) => device.kind === 'audioinput') ?? [];
	const audioOutputDevices = devices.filter((device) => device.kind === 'audiooutput') ?? [];

	return {
		audioInputDevices: audioInputDevices.filter((d) => d.deviceId !== 'default'),
		videoInputDevices: devices.filter((device) => device.kind === 'videoinput'),
		audioOutputDevices: audioOutputDevices.filter((d) => d.deviceId !== 'default'),
		defaultOutput: audioOutputDevices.find((d) => d.deviceId === 'default'),
		defaultInput: audioInputDevices.find((d) => d.deviceId === 'default'),
	};
}
