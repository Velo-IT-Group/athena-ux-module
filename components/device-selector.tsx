'use client';
import { useEffect, useState } from 'react';

import { useJabra } from '@/providers/jabra-provider';

import { Headset } from 'lucide-react';

import { webHidPairing } from '@gnaudio/jabra-js';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LabeledInput from '@/components/ui/labeled-input';
import { Separator } from '@/components/ui/separator';
import { Progress } from './ui/progress';
import { useDevice } from '@/providers/device-provider';

type Props = {
	className?: string;
};

const DeviceSelector = ({ className }: Props) => {
	const [open, setOpen] = useState(false);
	const [inputLevel, setInputLevel] = useState(0);
	// const { callControlDevices, setCurrentCallControl, currentCallControl, jabra, deviceState } = useJabra();
	const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
	const [outputDevices, setOutputDevices] = useState<MediaDeviceInfo[]>([]);
	const [selectedDevice, setSelectedDevice] = useState<string>();
	const { currentCallControl } = useDevice();

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
		// callControlDevices.forEach(async (d) => {
		// 	const { device } = d;
		// 	const de = inputDevices.find((d) => d.groupId === selectedDevice)?.label.includes(device.name);
		// 	if (!de) return;
		// 	// await webHidPairing();
		// 	// setCurrentCallControl(d);
		// });
	}, [inputDevices, selectedDevice]);

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
		<Popover
			open={open}
			onOpenChange={async (e) => {
				setOpen(e);
				if (!e || callControlDevices.length) return;
				// await webHidPairing();
			}}
		>
			<PopoverTrigger asChild>
				<Button
					variant='ghost'
					role='combobox'
					className={cn('col-span-3', className)}
				>
					<Headset />
				</Button>
			</PopoverTrigger>

			<PopoverContent className='w-80 space-y-3'>
				<LabeledInput
					label='Speaker'
					name='speaker'
				>
					<div className='grid grid-cols-[3fr_2fr] gap-1.5'>
						<Select
							name='speaker'
							value={selectedDevice}
							onValueChange={setSelectedDevice}
						>
							<SelectTrigger>
								<SelectValue placeholder='Select device...' />
							</SelectTrigger>

							<SelectContent>
								{outputDevices.map((device) => (
									<SelectItem
										key={device.deviceId}
										value={device.groupId}
									>
										{device.label.trim()}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Button
							variant='outline'
							className='text-xs'
							type='button'
							// onClick={async () => {
							// 	try {
							// 		if (deviceState?.callActive) {
							// 			await currentCallControl?.endCall();
							// 		}

							// 		await currentCallControl?.signalIncomingCall(5000);
							// 	} catch (error) {
							// 		console.error(error);
							// 	}
							// }}
						>
							Test Speaker
						</Button>
					</div>
				</LabeledInput>

				<LabeledInput
					label='Microphone'
					name='microphone'
				>
					<div className='grid grid-cols-[3fr_2fr] gap-1.5'>
						<Select
							name='microphone'
							value={selectedDevice}
							onValueChange={setSelectedDevice}
						>
							<SelectTrigger>
								<SelectValue placeholder='Select device...' />
							</SelectTrigger>

							<SelectContent>
								{inputDevices.map((device) => (
									<SelectItem
										key={device.deviceId}
										value={device.groupId}
									>
										{device.label.trim()}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Button
							variant='outline'
							className='text-xs'
						>
							Test Mic
						</Button>
					</div>

					<Progress value={inputLevel} />
				</LabeledInput>

				<Separator />

				<Button className='w-full'>Make a test call</Button>
			</PopoverContent>
		</Popover>
	);
};

export default DeviceSelector;
