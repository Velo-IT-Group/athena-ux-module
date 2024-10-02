'use client';
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Activity } from 'twilio-taskrouter';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Worker } from 'twilio-taskrouter';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Circle, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
	workers: Worker[];
	currentActivity?: Activity;
	conversations: Conversation[];
	activity: Activity;
	isCollapsed: boolean;
};

export const activityColors: Record<string, string> = {
	Available: 'bg-green-500',
	Unavailable: 'bg-red-500',
	Offline: 'bg-gray-500',
	Break: 'bg-gray-500',
	'On-Site': 'bg-orange-500',
};

const ActivityItem = ({ workers, currentActivity, conversations, activity, isCollapsed }: Props) => {
	return (
		<Popover>
			<ContextMenu>
				<Tooltip>
					<ContextMenuTrigger asChild>
						<TooltipTrigger asChild>
							<PopoverTrigger asChild>
								<Button
									variant='ghost'
									size={isCollapsed ? 'icon' : 'sm'}
									className={isCollapsed ? 'h-9 w-9' : 'justify-start'}
								>
									<Circle
										className={cn('stroke-none rounded-full', activityColors[activity.name], !isCollapsed && 'mr-1.5')}
									/>

									<span className={cn(isCollapsed && 'sr-only')}>{activity.name}</span>
								</Button>
							</PopoverTrigger>
						</TooltipTrigger>
					</ContextMenuTrigger>

					<ContextMenuContent>
						<ContextMenuItem
							onSelect={async () => await activity.setAsCurrent()}
							disabled={currentActivity?.sid === activity.sid}
						>
							Set as current activity
						</ContextMenuItem>
					</ContextMenuContent>

					<TooltipContent side='right'>
						{activity.name} ({workers.filter((worker) => worker.activitySid === activity.sid).length})
					</TooltipContent>
					<TooltipContent side='right'>
						{activity.name} ({workers.filter((worker) => worker.activitySid === activity.sid).length})
					</TooltipContent>
				</Tooltip>
			</ContextMenu>

			<PopoverContent
				side='right'
				align='start'
				sideOffset={6}
				className='p-0'
			>
				<Command>
					<CommandInput placeholder={'Search users'} />
					<CommandList>
						<CommandGroup heading={activity.name}>
							{workers?.map((worker) => {
								const workerConversations =
									conversations?.filter(
										(conversation) => conversation.agent === worker.sid && !conversation.talk_time
									) ?? [];
								return (
									<ActivityListItem
										key={worker.sid}
										worker={worker}
										conversations={workerConversations}
									/>
								);
							})}
						</CommandGroup>
					</CommandList>
					<CommandEmpty>Nothing users.</CommandEmpty>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

type ActivityListItemProps = {
	worker: Worker;
	conversations: Conversation[];
};

const ActivityListItem = ({ worker, conversations }: ActivityListItemProps) => {
	const workerAttributes = worker.attributes;

	return (
		<CommandItem
			key={worker.sid}
			value={workerAttributes.full_name}
			className='flex items-center gap-1.5'
		>
			<Avatar className='w-3.5 h-3.5'>
				<AvatarFallback className='w-3.5 h-3.5'>{workerAttributes.full_name.charAt(0)}</AvatarFallback>
				<AvatarImage
					className='w-3.5 h-3.5'
					src={workerAttributes.imageUrl}
				/>
			</Avatar>

			<div>
				<p>{workerAttributes.full_name}</p>
				{/* <p className='text-muted-foreground text-sm'>{worker.sid}</p> */}
			</div>

			{conversations?.length > 0 && (
				<Button
					variant='default'
					size='smIcon'
					className='ml-auto animate-pulse'
				>
					<Phone />
				</Button>
			)}
		</CommandItem>
	);
};

export default ActivityItem;
