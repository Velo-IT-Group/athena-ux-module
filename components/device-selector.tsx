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

type Props = {};

const DeviceSelector = (props: Props) => {
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
					className=' col-span-3'
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
