'use client';
import React from 'react';
import { Activity } from 'twilio-taskrouter';
import { Worker } from 'twilio-taskrouter';
import { ChevronDown, Circle, PhoneIncoming, PhoneOutgoing, Voicemail } from 'lucide-react';
import { cn, parsePhoneNumber } from '@/lib/utils';
import { SyncMapItem } from 'twilio-sync';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import useTimer from '@/hooks/useTimer';
import Timer from './timer';
import { formatDate } from '@/utils/date';
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
} from './ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Avatar, AvatarFallback } from './ui/avatar';

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

const ActivityItem = ({ workers, conversations, activity }: Props) => {
	return (
		<Collapsible className='group/collapsible'>
			<SidebarGroup>
				<SidebarGroupContent>
					<CollapsibleTrigger asChild>
						<SidebarMenuButton className='[&>svg]:size-3.5'>
							<Circle className={cn('stroke-none rounded-full', activityColors[activity.name])} />

							<span className='group-data-[collapsible=icon]:hidden'>{activity.name}</span>

							<ChevronDown className='group-data-[collapsible=icon]:hidden ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
						</SidebarMenuButton>
					</CollapsibleTrigger>

					<CollapsibleContent>
						<SidebarMenu>
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
										conversations={workerConversations}
										worker={worker}
									/>
								);
							})}
						</SidebarMenu>
					</CollapsibleContent>
				</SidebarGroupContent>
			</SidebarGroup>
		</Collapsible>
	);
};

type ActivityListItemProps = {
	worker: Worker;
	conversations: SyncMapItem[];
};

const ActivityListItem = ({ worker, conversations }: ActivityListItemProps) => {
	const workerAttributes = worker.attributes;

	return (
		<SidebarMenuItem>
			<SidebarMenuButton className='grid gap-1.5 h-auto p-1.5 pr-3'>
				<div className='flex items-center gap-1.5 text-nowrap'>
					<Avatar className='uppercase w-6 h-6'>
						<AvatarFallback className='text-[9px] font-medium'>
							{worker.friendlyName[0]}
							{worker.friendlyName[1]}
						</AvatarFallback>
					</Avatar>

					<p>{workerAttributes.full_name}</p>

					<p className='ml-auto text-xs'>
						since {formatDate({ timeStyle: 'short' }).format(worker.dateActivityChanged)}
					</p>
				</div>

				{conversations && conversations?.length > 0 && (
					<SidebarMenuSub className='px-0 mr-0'>
						{conversations?.map((conversation) => {
							const task = conversation.data as TaskInstance;
							return (
								<TaskListItem
									key={`${worker.sid}-${conversation.key}`}
									task={task}
								/>
							);
						})}
					</SidebarMenuSub>
				)}
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};

const TaskListItem = ({ task }: { task: TaskInstance }) => {
	const attributes = JSON.parse(task?.attributes ?? '{}');
	const timer = useTimer(new Date(task.dateUpdated));

	return (
		<SidebarMenuSubButton className='flex items-center gap-3 text-xs border-b pb-1.5 [&>svg]:size-4 last:pb-0 last:border-b-0 w-full'>
			{attributes.taskType === 'voicemail' && <Voicemail />}
			{attributes.taskType !== 'voicemail' && attributes.direction === 'outbound' ? (
				<PhoneOutgoing />
			) : (
				<PhoneIncoming />
			)}

			<div>
				<p className='text-nowrap text-ellipsis font-medium'>
					{attributes.name ?? parsePhoneNumber(attributes.outbound_to).formattedNumber}
				</p>

				<Timer
					className='ml-auto text-muted-foreground '
					timer={timer}
				/>
			</div>
		</SidebarMenuSubButton>
	);
};

export default ActivityItem;
