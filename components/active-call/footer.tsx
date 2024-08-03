'use client';
import React from 'react';
import { CardFooter } from '../ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';
import {
	ArrowRightFromLine,
	Circle,
	Ellipsis,
	Grip,
	Mic,
	MicOff,
	Pause,
	Phone,
	PhoneForwarded,
	Settings,
	UserPlus,
} from 'lucide-react';
import { PopoverTrigger } from '../ui/popover';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useRecoilValue } from 'recoil';
import { callStateAtom } from '@/atoms/twilioStateAtom';

type Props = {};

const ActiveCallFooter = (props: Props) => {
	const activeCall = useRecoilValue(callStateAtom);

	return (
		<CardFooter className='p-3 border-t space-x-1.5 justify-between'>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant={activeCall.call?.isMuted() ? 'destructive' : 'accepting'}
						size='icon'
						onClick={() => activeCall.call?.mute(!activeCall.call?.isMuted() ?? true)}
					>
						<Mic className='w-3.5 h-3.5' />
					</Button>
				</TooltipTrigger>

				<TooltipContent
					side='top'
					align='center'
				>
					<span>Mute</span>
				</TooltipContent>
			</Tooltip>

			<div className='flex items-center gap-1.5'>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							className='text-red-500 w-9 flex flex-col'
							variant='secondary'
							size='icon'
						>
							<Circle className='w-3 h-3 fill-red-500 text-red-500 animate-pulse' />
							<span className='text-xs'>Rec</span>
						</Button>
					</TooltipTrigger>

					<TooltipContent
						side='top'
						align='center'
					>
						<span>Stop Recording</span>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<PopoverTrigger asChild>
							<Button
								variant='secondary'
								size='icon'
							>
								<Grip className='h-3.5 w-3.5' />
							</Button>
						</PopoverTrigger>
					</TooltipTrigger>

					<TooltipContent
						side='top'
						align='center'
					>
						<span>Show Keypad</span>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant='secondary'
							size='icon'
						>
							<Pause className='h-3.5 w-3.5' />
						</Button>
					</TooltipTrigger>

					<TooltipContent
						side='top'
						align='center'
					>
						<span>Put call on hold</span>
					</TooltipContent>
				</Tooltip>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='secondary'
							size='icon'
						>
							<Ellipsis className='h-3.5 w-3.5' />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						side='top'
						align='end'
						className='w-48 dark'
						avoidCollisions
					>
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<Pause className='mr-3' />
								<span>Hold</span>
							</DropdownMenuItem>

							<DropdownMenuItem>
								<UserPlus className='mr-3' />
								<span>Add People</span>
							</DropdownMenuItem>

							<DropdownMenuItem>
								<PhoneForwarded className='mr-3' />
								<span>Transfer Call</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem>
								<MicOff className='mr-3' />
								<span>Mute Mic</span>
							</DropdownMenuItem>

							<DropdownMenuItem>
								<Circle className='mr-3' />
								<span>Record Call</span>
							</DropdownMenuItem>

							<DropdownMenuItem>
								<Grip className='mr-3' />
								<span>Show Keypad</span>
							</DropdownMenuItem>

							<DropdownMenuItem>
								<Settings className='mr-3' />
								<span>Audio Settings</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem>
								<ArrowRightFromLine className='mr-3' />
								<span>Leave Call</span>
							</DropdownMenuItem>

							<DropdownMenuItem>
								<Phone className='mr-3 rotate-[135deg] text-red-500' />
								<span>End Call</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant='destructive'
						size='icon'
						onClick={() => activeCall.call?.disconnect()}
					>
						<Phone className='rotate-[135deg]' />
					</Button>
				</TooltipTrigger>

				<TooltipContent
					side='top'
					align='center'
				>
					<span>End Call</span>
				</TooltipContent>
			</Tooltip>
		</CardFooter>
	);
};

export default ActiveCallFooter;
