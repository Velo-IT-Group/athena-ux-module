import React, { useState, useEffect, useCallback } from 'react';
import useDevices from '@/hooks/useDevices';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const labels = {
	audioinput: {
		audioLevelText: 'Input level',
		headerText: 'Microphone',
	},
	audiooutput: {
		audioLevelText: 'Output level',
		headerText: 'Speaker',
	},
};

interface AudioDeviceProps {
	disabled: boolean;
	kind: 'audioinput' | 'audiooutput';
	onDeviceChange: (value: string) => void;
	setDeviceError: (value: string) => void;
	error?: string;
}

export function AudioDevice({ disabled, kind, onDeviceChange, setDeviceError, error }: AudioDeviceProps) {
	const devices = useDevices();
	const audioDevices = kind === 'audiooutput' ? devices.audioOutputDevices : devices.audioInputDevices;
	const [selectedDevice, setSelectedDevice] = useState('');
	const { headerText } = labels[kind];
	const noAudioRedirect = !Audio.prototype.setSinkId && kind === 'audiooutput';

	const updateSelectedDevice = useCallback(
		(value: string) => {
			onDeviceChange(value);
			setSelectedDevice(value);
			setDeviceError('');
		},
		[onDeviceChange, setSelectedDevice, setDeviceError]
	);

	useEffect(() => {
		const hasSelectedDevice = audioDevices.some((device) => device.deviceId === selectedDevice);
		if (audioDevices.length && !hasSelectedDevice) {
			updateSelectedDevice(audioDevices[0].deviceId);
		}
	}, [audioDevices, devices, selectedDevice, updateSelectedDevice]);

	return (
		<>
			<p className='font-medium text-sm'>{headerText}</p>

			{noAudioRedirect && (
				<div>
					<p>System Default Audio Output</p>
				</div>
			)}

			{!noAudioRedirect && (
				<Select
					defaultValue={selectedDevice}
					onValueChange={(e) => updateSelectedDevice(e)}
					disabled={disabled}
				>
					<SelectTrigger>
						<SelectValue placeholder='Select item' />
					</SelectTrigger>

					<SelectContent>
						{audioDevices.map((device) => (
							<SelectItem
								key={device.deviceId}
								value={device.deviceId}
							>
								{device.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}

			{/* {error && (
				<div className={classes.error}>
					<SmallError />
					<Typography
						variant='subtitle2'
						color='error'
					>
						{error === 'No audio detected' ? 'No audio detected.' : 'Unable to connect.'}
					</Typography>
				</div>
			)} */}
		</>
	);
}

export default React.memo(AudioDevice);
