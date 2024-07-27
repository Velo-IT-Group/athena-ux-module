'use client';
import React, { useEffect, useState } from 'react';
import { DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from './ui/dropdown-menu';
import { Check, Circle, Headset } from 'lucide-react';
import { useJabra } from '@/providers/jabra-provider';
import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator } from './ui/command';
import { cn } from '@/lib/utils';

type Props = {};

const DeviceDropdownMenuSub = (props: Props) => {
	const [open, setOpen] = useState(false);
	const [inputLevel, setInputLevel] = useState(0);
	const { callControlDevices, currentCallControl, jabra, deviceState } = useJabra();
	const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
	const [outputDevices, setOutputDevices] = useState<MediaDeviceInfo[]>([]);
	const [selectedDevice, setSelectedDevice] = useState<string>();

	useEffect(() => {
		navigator.mediaDevices.enumerateDevices().then((devices) => {
			console.log(devices);
			const iDevices = devices.filter((d) => d.kind === 'audioinput');
			const oDevices = devices.filter((d) => d.kind === 'audiooutput');

			const inputIndex = iDevices.findIndex((d) => d.label.includes('Default'));
			const outputIndex = oDevices.findIndex((d) => d.label.includes('Default'));

			const [iRemoved] = iDevices.splice(inputIndex, 1);
			const [oRemoved] = oDevices.splice(outputIndex, 1);

			setInputDevices(iDevices);
			setOutputDevices(oDevices);

			setSelectedDevice(iRemoved.groupId);
		});
	}, []);

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

	return (
		<DropdownMenuSub>
			<DropdownMenuSubContent>
				<Command>
					<CommandList>
						<CommandGroup heading='Speaker'>
							<CommandList>
								{outputDevices.map((device) => (
									<CommandItem
										key={device.groupId}
										value={device.groupId}
									>
										<Check
											className={cn('mr-2 h-4 w-4', device?.groupId === selectedDevice ? 'opacity-100' : 'opacity-0')}
										/>
										{device.label}
									</CommandItem>
								))}
							</CommandList>
						</CommandGroup>

						<CommandSeparator />

						<CommandGroup heading='Microphone'>
							{inputDevices.map((device) => (
								<CommandItem
									key={device.groupId}
									value={device.groupId}
								>
									<Check
										className={cn('mr-2 h-4 w-4', device?.groupId === selectedDevice ? 'opacity-100' : 'opacity-0')}
									/>
									{device.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</DropdownMenuSubContent>
			<DropdownMenuSubTrigger>
				<Headset className='mr-1.5' /> {outputDevices.find((d) => d.groupId === selectedDevice)?.label}
			</DropdownMenuSubTrigger>
		</DropdownMenuSub>
	);
};

export default DeviceDropdownMenuSub;
