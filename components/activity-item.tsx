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
import { Circle, Phone, PhoneIncoming, PhoneOutgoing, Smartphone, Voicemail } from 'lucide-react';
import { cn, parsePhoneNumber } from '@/lib/utils';
import { SyncMapItem } from 'twilio-sync';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { Separator } from './ui/separator';
import useTimer from '@/hooks/useTimer';
import Timer from './timer';
import { relativeDate } from '@/utils/date';

type Props = {
	workers: Worker[];
	currentActivity?: Activity;
	conversations: SyncMapItem[];
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
	'use no memo';
	// console.log(conversations);
	return (
		<Popover>
			<ContextMenu>
				<Tooltip>
					<ContextMenuTrigger asChild>
						<TooltipTrigger asChild>
							<PopoverTrigger asChild>
								<Button
									variant={currentActivity?.sid === activity.sid ? 'secondary' : 'ghost'}
									size={isCollapsed ? 'icon' : 'sm'}
									className={cn(
										isCollapsed ? 'h-9 w-9' : 'justify-start',
										currentActivity?.sid === activity.sid && 'bg-secondary'
									)}
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
				sideOffset={12}
				className='p-0'
			>
				<Command>
					<CommandInput placeholder={'Search users'} />
					<CommandList>
						<CommandGroup heading={activity.name}>
							{workers?.map((worker) => {
								const workerConversations =
									conversations?.filter((conversation) => {
										const data = conversation.data as TaskInstance;
										const attributes = JSON.parse(data?.attributes ?? '{}');
										return attributes.worker_sid === worker.sid;
									}) ?? [];
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
	conversations: SyncMapItem[];
};

const ActivityListItem = ({ worker, conversations }: ActivityListItemProps) => {
	'use no memo';

	const workerAttributes = worker.attributes;
	// const timer = useTimer(worker.dateActivityChanged);

	// console.log(worker.dateActivityChanged);
	return (
		<CommandItem
			// key={worker.sid}
			value={workerAttributes.full_name}
			className='grid gap-1.5'
		>
			<div className='flex items-center gap-1.5'>
				<p>{workerAttributes.full_name}</p>

				<p className='ml-auto text-xs'>{relativeDate(worker.dateActivityChanged)}</p>

				{/* <Timer
					timer={timer}
					className='ml-auto'
				/> */}
			</div>

			{conversations && conversations?.length > 0 && (
				<>
					<Separator />
					<div className='pl-3'>
						{conversations?.map((conversation) => {
							const task = conversation.data as TaskInstance;
							return (
								<TaskListItem
									key={`${worker.sid}-${conversation.key}`}
									task={task}
								/>
							);
						})}
					</div>
				</>
			)}
		</CommandItem>
	);
};

const TaskListItem = ({ task }: { task: TaskInstance }) => {
	const attributes = JSON.parse(task?.attributes ?? '{}');
	const timer = useTimer(new Date(task.dateUpdated));

	return (
		<div className='flex items-center gap-1.5 text-xs text-muted-foreground border-b pb-1.5 last:pb-0 last:border-b-0'>
			{attributes.taskType === 'voicemail' && <Voicemail />}
			{attributes.taskType !== 'voicemail' && attributes.direction === 'outbound' ? (
				<PhoneOutgoing />
			) : (
				<PhoneIncoming />
			)}

			<p>{attributes.name ?? parsePhoneNumber(attributes.outbound_to).formattedNumber}</p>

			<Timer
				className='ml-auto'
				timer={timer}
			/>
		</div>
	);
};

export default ActivityItem;
