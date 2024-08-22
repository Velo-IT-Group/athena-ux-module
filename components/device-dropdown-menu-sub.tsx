'use client';
import { DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from './ui/dropdown-menu';
import { Check, Headset } from 'lucide-react';
import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator } from './ui/command';
import { cn } from '@/lib/utils';
import { useDevice } from '@/providers/device-provider';
import { selectInputDevice, selectOutputDevice } from '@/utils/twilio/device';

type Props = {};

const DeviceDropdownMenuSub = (props: Props) => {
	const { device } = useDevice();

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
