'use client';
import React, { useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Circle, Headset, LogOut, SquareUser, UserCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useJabra } from '@/providers/jabra-provider';
import { webHidPairing } from '@gnaudio/jabra-js';

type Props = {};

const UserInfo = (props: Props) => {
	const { currentCallControl, setCurrentCallControl, callControlDevices } = useJabra();

	useEffect(() => {
		if (callControlDevices.length !== 1) return;

		setCurrentCallControl(callControlDevices[0]);
	}, [callControlDevices, setCurrentCallControl]);

	return (
		<Popover>
			<Tooltip>
				<TooltipTrigger asChild>
					<PopoverTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
							className='mt-auto rounded-lg'
							aria-label='Account'
						>
							<SquareUser className='size-3.5' />
						</Button>
					</PopoverTrigger>
				</TooltipTrigger>

				<TooltipContent
					side='right'
					sideOffset={5}
				>
					Account
				</TooltipContent>
			</Tooltip>

			<PopoverContent
				align='end'
				side='right'
				className='z-50 md:min-w-48 mt-1.5 space-y-1.5'
			>
				<header className='p-0 justify-start gap-3'>
					<div>
						<p className='font-semibold text-sm'>Nick Black</p>
						<p className='text-sm'>Nick Black</p>
					</div>
				</header>

				<section className='px-0'>
					<div className='grid grid-cols-5 gap-1.5'>
						{/* <ActivitySelector className='col-span-2' /> */}
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={'outline'}
									// onClick={async () => await webHidPairing()}
									className='justify-start text-left font-normal col-span-2'
								>
									<Circle className={cn('mr-1.5 h-3 w-3')} />
									<span>{'Available'}</span>
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-auto p-0'></PopoverContent>
						</Popover>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='outline'
									className=' col-span-3'
								>
									<Headset className=' h-3.5 mr-1.5' />
									{/* {currentCallControl ? currentCallControl.device.name : 'Open'} */}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className='w-56'>
								<DropdownMenuLabel>Devices</DropdownMenuLabel>
								{callControlDevices.map((controlDevice) => {
									const { device } = controlDevice;
									return (
										<DropdownMenuCheckboxItem
											key={device.id.toString()}
											defaultChecked={currentCallControl?.device.id === device.id}
											checked={currentCallControl?.device.id === device.id}
											onCheckedChange={() => {
												webHidPairing().then((data) => {
													setCurrentCallControl(controlDevice);
												});
											}}
										>
											{device.name}
										</DropdownMenuCheckboxItem>
									);
								})}
								<DropdownMenuSeparator />
							</DropdownMenuContent>
						</DropdownMenu>

						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={'outline'}
									className='justify-start text-left font-normal col-span-5'
								>
									<UserCircle className='w-3 h-3 mr-3' />
									<span>Manage account</span>
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-auto p-0'></PopoverContent>
						</Popover>

						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={'outline'}
									className='justify-start text-left font-normal col-span-5'
									// onClick={async () => signOut()}
								>
									<LogOut className='w-3 h-3 mr-3' />
									<span>Sign out</span>
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-auto p-0'></PopoverContent>
						</Popover>
					</div>
				</section>
			</PopoverContent>
		</Popover>
	);
};

export default UserInfo;
