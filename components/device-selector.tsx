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

type Props = {
	className?: string;
};

const DeviceSelector = ({ className }: Props) => {
	const { callControlDevices, setCurrentCallControl, currentCallControl, jabra } = useJabra();
	const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
	const [outputDevices, setOutputDevices] = useState<MediaDeviceInfo[]>([]);
	const [selectedDevice, setSelectedDevice] = useState<string>();

	useEffect(() => {
		navigator.mediaDevices.enumerateDevices().then((devices) => {
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
		callControlDevices.forEach(async (d) => {
			const { device } = d;
			const de = inputDevices.find((d) => d.groupId === selectedDevice)?.label.includes(device.name);
			if (!de) return;
			await webHidPairing();
			setCurrentCallControl(d);
		});
	}, [callControlDevices, inputDevices, selectedDevice]);

	return (
		<Popover
			onOpenChange={async (e) => {
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
				</LabeledInput>

				<Separator />

				<Button className='w-full'>Make a test call</Button>

				{/* {callControlDevices.map((controlDevice) => {
					const { device } = controlDevice;
					return (
						<DropdownMenuCheckboxItem
							key={device.id.id}
							defaultChecked={currentCallControl?.device.id.id === device.id.id}
							checked={currentCallControl?.device.id.id === device.id.id}
							onCheckedChange={() => {
								setCurrentCallControl(controlDevice);
							}}
						>
							{device.name}
						</DropdownMenuCheckboxItem>
					);
				})}  */}
			</PopoverContent>
		</Popover>
	);
};

export default DeviceSelector;
