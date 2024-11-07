'use client';
import React, { act } from 'react';
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
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from './ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogTrigger } from './ui/dialog';
import WorkerDialog from './worker-dialog';

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
		<Collapsible
			className='group/collapsible'
			title={activity.name}
		>
			<SidebarGroup>
				<SidebarGroupLabel asChild>
					<CollapsibleTrigger asChild>
						<SidebarMenuButton
							size='sm'
							className='[&>svg]:size-3.5'
						>
							<Circle className={cn('stroke-none rounded-full', activityColors[activity.name])} />

							<span>{activity.name}</span>

							<ChevronDown className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
						</SidebarMenuButton>
					</CollapsibleTrigger>
				</SidebarGroupLabel>

				<CollapsibleContent>
					<SidebarGroupContent>
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
					</SidebarGroupContent>
				</CollapsibleContent>
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
		<Dialog>
			<SidebarMenuItem>
				<DialogTrigger asChild>
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
							<SidebarMenuSub className='pr-0 mr-0'>
								{conversations?.map((conversation) => {
									const task = conversation.data as TaskInstance;
									return (
										<SidebarMenuSubItem key={`${worker.sid}-${conversation.key}`}>
											<TaskListItem task={task} />
										</SidebarMenuSubItem>
									);
								})}
							</SidebarMenuSub>
						)}
					</SidebarMenuButton>
				</DialogTrigger>
			</SidebarMenuItem>

			<WorkerDialog
				worker={worker}
				workerAttributes={workerAttributes}
			/>
		</Dialog>
	);
};

const TaskListItem = ({ task }: { task: TaskInstance }) => {
	const attributes = JSON.parse(task?.attributes ?? '{}');
	const timer = useTimer(new Date(task.dateUpdated));

	return (
		<SidebarMenuSubButton className='flex items-center gap-1.5 text-xs text-muted-foreground border-b pb-1.5 last:pb-0 last:border-b-0 w-full'>
			{attributes.taskType === 'voicemail' && <Voicemail className='size-3' />}
			{attributes.taskType !== 'voicemail' && attributes.direction === 'outbound' ? (
				<PhoneOutgoing className='size-3' />
			) : (
				<PhoneIncoming className='size-3' />
			)}

			<p className='text-nowrap text-ellipsis'>
				{attributes.name ?? parsePhoneNumber(attributes.outbound_to).formattedNumber}
			</p>

			<Timer
				className='ml-auto'
				timer={timer}
			/>
		</SidebarMenuSubButton>
	);
};

export default ActivityItem;
