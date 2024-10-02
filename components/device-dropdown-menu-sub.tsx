'use client';
import { DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from './ui/dropdown-menu';
import { Check, Headset } from 'lucide-react';
import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator } from './ui/command';
import { cn } from '@/lib/utils';
import { useDevice } from '@/providers/device-provider';
import useDevices from '@/hooks/useDevices';

const DeviceDropdownMenuSub = () => {
	const { audioOutputDevices, audioInputDevices, defaultInput, defaultOutput } = useDevices();
	const { device } = useDevice();

	if (!device?.audio) return;

	const isSameDevice = defaultInput?.label === defaultOutput?.label;

	return (
		<DropdownMenuSub>
			<DropdownMenuSubContent>
				<Command>
					<CommandList>
						<CommandGroup heading='Speaker'>
							{audioOutputDevices.map((mediaDevice) => {
								return (
									<CommandItem
										key={mediaDevice.deviceId}
										value={mediaDevice.groupId}
									>
										<Check
											className={cn(
												'mr-2 h-3.5 w-3.5',
												defaultOutput?.groupId === mediaDevice.groupId ? 'opacity-100' : 'opacity-0'
											)}
										/>
										{mediaDevice.label}
									</CommandItem>
								);
							})}
						</CommandGroup>

						<CommandSeparator />

						<CommandGroup heading='Microphone'>
							{audioInputDevices.map((mediaDevice) => {
								return (
									<CommandItem
										key={mediaDevice.deviceId}
										value={mediaDevice.groupId}
									>
										<Check
											className={cn(
												'mr-2 h-3.5 w-3.5',
												defaultOutput?.groupId === mediaDevice.groupId ? 'opacity-100' : 'opacity-0'
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
						<Headset className='mr-1.5' /> {defaultInput?.label ?? 'Select Input Device'}
					</>
				) : (
					<></>
				)}
			</DropdownMenuSubTrigger>
		</DropdownMenuSub>
	);
};

export default DeviceDropdownMenuSub;
