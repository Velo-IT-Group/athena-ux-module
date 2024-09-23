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
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useDevice } from '@/providers/device-provider';
import WorkerSelector from '@/app/(user)/worker-selector';
import { parsePhoneNumber } from '@/lib/utils';
import OutboundDialerContent from '../outbound-dialer-content';
import { useTaskContext } from './context';

const ActiveCallFooter = () => {
	const { transferTask, addExternalParticipant, task, endConference } = useTaskContext();
	const { muted, setMuted } = useDevice();

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
						<WorkerSelector
							actionFn={(isWorker, id) => {
								if (isWorker) {
									transferTask?.mutate({ to: id as string, options: {} });
								} else {
									addExternalParticipant?.mutate({
										From: task?.attributes.to,
										To: parsePhoneNumber(id as string, 'US', 'E.164').formattedNumber ?? '',
									});
								}
							}}
						>
							<Button
								variant='secondary'
								size='icon'
							>
								<PhoneForwarded />
							</Button>
						</WorkerSelector>
					</TooltipTrigger>

					<TooltipContent
						side='top'
						align='center'
					>
						<span>Transfer Call</span>
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
						side='bottom'
						align='end'
					>
						<OutboundDialerContent
							numbers={[]}
							onSubmit={(data) => {
								addExternalParticipant?.mutate({
									From: task?.attributes.to,
									To: parsePhoneNumber(data.get('To') as string, 'US', 'E.164').formattedNumber ?? '',
								});
							}}
						/>
					</PopoverContent>
				</Popover>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant='secondary'
							size='icon'
							onClick={async () => {
								// await task?.hold(task.attributes.workerSid, true);
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
						onClick={() => endConference?.()}
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
