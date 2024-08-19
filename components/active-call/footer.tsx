'use client';
import React, { useTransition } from 'react';
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
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useDevice } from '@/providers/device-provider';
import { useTask } from './context';
import { Dialpad } from '../dialpad';
import { updateConference } from '@/lib/twilio/conference/helpers';
import { updateConferenceAction } from './actions';

const ActiveCallFooter = () => {
	const { task } = useTask();
	const { activeCall, muted, setMuted } = useDevice();
	const [isPending, startTransition] = useTransition();

	return (
		<CardFooter className='p-3 border-t space-x-1.5 justify-between'>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant={muted ? 'destructive' : 'accepting'}
						size='icon'
						onClick={() => setMuted((prev) => !prev)}
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

				<Popover>
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

					<PopoverContent
						side='left'
						className='dark'
					>
						<Dialpad />
					</PopoverContent>
				</Popover>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant='secondary'
							size='icon'
							onClick={async () => {
								await task?.hold(task.attributes.workerSid, true);
							}}
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
						onClick={() => {
							startTransition(async () => {
								activeCall?.disconnect();
								await updateConferenceAction(task?.attributes.conference.sid, {
									status: 'completed',
								});
								await task?.wrapUp({ reason: 'Call ended' });
							});
						}}
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
