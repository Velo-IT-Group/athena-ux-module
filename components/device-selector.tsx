'use client';
import { useJabra } from '@/providers/jabra-provider';
import React from 'react';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { webHidPairing } from '@gnaudio/jabra-js';
import { Headset } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
	className?: string;
};

const DeviceSelector = ({ className }: Props) => {
	const { callControlDevices, setCurrentCallControl, currentCallControl } = useJabra();

	console.log(callControlDevices, currentCallControl);

	return (
		<DropdownMenu
			onOpenChange={async (e) => {
				if (!e || callControlDevices.length) return;
				await webHidPairing();
			}}
		>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					className={cn('col-span-3', className)}
				>
					<Headset className=' h-3.5 mr-1.5' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuLabel>Devices</DropdownMenuLabel>
				{callControlDevices.map((controlDevice) => {
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
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default DeviceSelector;
