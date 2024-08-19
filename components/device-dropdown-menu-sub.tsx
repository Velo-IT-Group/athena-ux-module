'use client';
import React, { useEffect, useState } from 'react';
import { DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from './ui/dropdown-menu';
import { Check, Circle, Headset } from 'lucide-react';
import { useJabra } from '@/providers/jabra-provider';
import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator } from './ui/command';
import { cn } from '@/lib/utils';
import { useRecoilValue } from 'recoil';
import { callControlDevicesState, currentCallControlState } from '@/atoms/jabraStateAtom';
import { useDevice } from '@/providers/device-provider';
import { selectInputDevice, selectOutputDevice } from '@/utils/twilio/device';

type Props = {};

const DeviceDropdownMenuSub = (props: Props) => {
	const [open, setOpen] = useState(false);
	const [inputLevel, setInputLevel] = useState(0);
	const { device } = useDevice();
	const callControlDevices = useRecoilValue(callControlDevicesState);
	const currentCallControl = useRecoilValue(currentCallControlState);
	const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
	const [outputDevices, setOutputDevices] = useState<MediaDeviceInfo[]>([]);
	const [selectedDevice, setSelectedDevice] = useState<string>();

	// useEffect(() => {
	// 	if (!device?.audio) return;
	// 	navigator.mediaDevices.enumerateDevices().then((devices) => {
	// 		console.log(devices);
	// 		const iDevices = devices.filter((d) => d.kind === 'audioinput');
	// 		const oDevices = devices.filter((d) => d.kind === 'audiooutput');

	// 		const inputIndex = iDevices.findIndex((d) => d.label.includes('Default'));
	// 		const outputIndex = oDevices.findIndex((d) => d.label.includes('Default'));

	// 		const [iRemoved] = iDevices.splice(inputIndex, 1);
	// 		const [oRemoved] = oDevices.splice(outputIndex, 1);

	// 		setInputDevices(iDevices);
	// 		setOutputDevices(oDevices);

	// 		setSelectedDevice(iRemoved.groupId);
	// 	});
	// }, []);

	useEffect(() => {
		if (!currentCallControl) return;
		callControlDevices.forEach(async (d) => {
			const { device } = d;
			const de = inputDevices.find((d) => d.groupId === selectedDevice)?.label.includes(device.name);
			if (!de) return;
			// await webHidPairing();
			// setCurrentCallControl(d);
		});
	}, [callControlDevices, inputDevices, selectedDevice]);

	useEffect(() => {
		if (!open) return;
		navigator.mediaDevices
			.getUserMedia({
				audio: true,
				video: false,
			})
			.then(function (stream) {
				const audioContext = new AudioContext();
				const analyser = audioContext.createAnalyser();
				const microphone = audioContext.createMediaStreamSource(stream);
				const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

				analyser.smoothingTimeConstant = 0.8;
				analyser.fftSize = 1024;

				microphone.connect(analyser);
				analyser.connect(scriptProcessor);
				scriptProcessor.connect(audioContext.destination);
				scriptProcessor.onaudioprocess = function () {
					const array = new Uint8Array(analyser.frequencyBinCount);
					analyser.getByteFrequencyData(array);
					const arraySum = array.reduce((a, value) => a + value, 0);
					const average = arraySum / array.length;
					setInputLevel(average);
					// colorPids(average);
				};
			})
			.catch(function (err) {
				/* handle the error */
				console.error(err);
			});
	}, [open]);

	if (!device?.audio) return;

	return (
		<DropdownMenuSub>
			<DropdownMenuSubContent>
				<Command>
					<CommandList>
						<CommandGroup heading='Speaker'>
							<CommandList>
								{/* setAvailableInputDevices(Array.from(device.audio?.availableInputDevices?.values() ?? []));
								setAvailableOutputDevices(Array.from(device.audio?.availableOutputDevices?.values() ?? [])); */}
								{Array.from(device?.audio.availableOutputDevices?.values()).map((value) => {
									const mediaDevice = value as MediaDeviceInfo;
									return (
										<CommandItem
											key={mediaDevice.deviceId}
											value={mediaDevice.groupId}
											onClick={async () => {
												await selectOutputDevice(mediaDevice.deviceId, device);
											}}
										>
											<Check
												className={cn('mr-2 h-3.5 w-3.5', mediaDevice?.groupId === '' ? 'opacity-100' : 'opacity-0')}
											/>
											{mediaDevice.label}
										</CommandItem>
									);
								})}
							</CommandList>
						</CommandGroup>

						<CommandSeparator />

						<CommandGroup heading='Microphone'>
							{Array.from(device?.audio.availableInputDevices?.values()).map((value) => {
								const mediaDevice = value as MediaDeviceInfo;
								return (
									<CommandItem
										key={mediaDevice.deviceId}
										value={mediaDevice.groupId}
										onClick={async () => {
											await selectInputDevice(mediaDevice.deviceId, device);
										}}
									>
										<Check
											className={cn(
												'mr-2 h-3.5 w-3.5',
												mediaDevice?.groupId === device.audio?.inputDevice?.groupId ? 'opacity-100' : 'opacity-0'
											)}
										/>
										{mediaDevice.label}
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</DropdownMenuSubContent>

			<DropdownMenuSubTrigger>
				<Headset className='mr-1.5' /> {device.audio.inputDevice?.label}
			</DropdownMenuSubTrigger>
		</DropdownMenuSub>
	);
};

export default DeviceDropdownMenuSub;
