'use client';
import { DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from './ui/dropdown-menu';
import { Check, Headset } from 'lucide-react';
import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator } from './ui/command';
import { cn } from '@/lib/utils';
import { useDevice } from '@/providers/device-provider';
import { selectInputDevice, selectOutputDevice, setSelectedDevice } from '@/utils/twilio/device';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Props = {};

const DeviceDropdownMenuSub = (props: Props) => {
	const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
	const [selectedInput, setSelectedInput] = useState<MediaDeviceInfo>();
	const [selectedOutput, setSelectedOutput] = useState<MediaDeviceInfo>();
	const { device } = useDevice();

	if (!device?.audio) return;

	function refreshDevices() {
		navigator.mediaDevices.enumerateDevices().then((foundDevices) => {
			setDevices(foundDevices.filter((device) => !device.label.includes('Default')));
			const defaultOutput = foundDevices.find(
				(device) => device.label.includes('Default') && device.kind === 'audiooutput'
			);
			const defaultInput = foundDevices.find(
				(device) => device.label.includes('Default') && device.kind === 'audioinput'
			);
			setSelectedOutput(
				foundDevices.find((device) => device.groupId === defaultOutput?.groupId && !device.label.includes('Default'))
			);
			setSelectedInput(
				foundDevices.find((device) => device.groupId === defaultInput?.groupId && !device.label.includes('Default'))
			);
		});
	}

	useEffect(() => {
		if (!window || !navigator) return;
		refreshDevices();
		navigator.mediaDevices.addEventListener('devicechange', refreshDevices);

		return function cleanup() {
			navigator.mediaDevices.removeEventListener('devicechange', refreshDevices);
		};
	}, [window, navigator]);

	const selectedDevice = (selectedDevice: MediaDeviceInfo) => {
		try {
			setSelectedDevice(selectedDevice, device);
			setSelectedDevice;

			toast.success(`Set ${selectedDevice.label} as your audio device.`);
		} catch (e) {
			toast.error(`There was an error attempting to set ${selectedDevice.label} as your audio device.`);
		}
	};

	const isSameDevice = selectedInput?.label === selectedOutput?.label;

	return (
		<DropdownMenuSub>
			<DropdownMenuSubContent>
				<Command>
					<CommandList>
						<CommandGroup heading='Speaker'>
							<CommandList>
								{devices
									.filter((device) => device.kind === 'audiooutput')
									.map((value) => {
										const mediaDevice = value as MediaDeviceInfo;
										return (
											<CommandItem
												key={mediaDevice.deviceId}
												value={mediaDevice.groupId}
												onClick={() => selectedDevice(mediaDevice)}
											>
												<Check
													className={cn(
														'mr-2 h-3.5 w-3.5',
														selectedOutput?.groupId === mediaDevice.groupId ? 'opacity-100' : 'opacity-0'
													)}
												/>
												{mediaDevice.label}
											</CommandItem>
										);
									})}
							</CommandList>
						</CommandGroup>

						<CommandSeparator />

						<CommandGroup heading='Microphone'>
							{devices
								.filter((device) => device.kind === 'audioinput')
								.map((value) => {
									const mediaDevice = value as MediaDeviceInfo;
									return (
										<CommandItem
											key={mediaDevice.deviceId}
											value={mediaDevice.groupId}
											onClick={() => selectedDevice(mediaDevice)}
										>
											<Check
												className={cn(
													'mr-2 h-3.5 w-3.5',
													selectedInput?.groupId === mediaDevice.groupId ? 'opacity-100' : 'opacity-0'
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
				{isSameDevice ? (
					<>
						<Headset className='mr-1.5' /> {selectedInput?.label ?? 'Select Input Device'}
					</>
				) : (
					<></>
				)}
			</DropdownMenuSubTrigger>
		</DropdownMenuSub>
	);
};

export default DeviceDropdownMenuSub;
