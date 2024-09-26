'use client';
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from './ui/command';
import { Activity, Workspace } from 'twilio-taskrouter';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { Worker } from 'twilio-taskrouter';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { Circle, Phone, Speaker, Voicemail, Volume2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useWorker } from '../providers/worker-provider';

type Props = {
	workers: Worker[];
	conversations: Conversation[];
	workspace: Workspace;
	activity: Activity;
	isCollapsed: boolean;
	onOpenChanges: (open: boolean) => void;
};

const activityColors: Record<string, string> = {
	Available: 'bg-green-500',
	Unavailable: 'bg-red-500',
	Offline: 'bg-gray-500',
	Break: 'bg-gray-500',
	'On-Site': 'bg-orange-500',
};

const ActivityItem = ({ workers, workspace, conversations, activity, isCollapsed, onOpenChanges }: Props) => {
	return (
		<Popover key={activity.sid}>
			<Tooltip delayDuration={0}>
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

				<TooltipContent side='right'>
					{activity.name} ({workers.filter((worker) => worker.activitySid === activity.sid).length})
				</TooltipContent>
				<TooltipContent side='right'>
					{activity.name} ({workers.filter((worker) => worker.activitySid === activity.sid).length})
				</TooltipContent>
			</Tooltip>

			<PopoverContent
				side='right'
				align='center'
				sideOffset={6}
				className='p-0'
			>
				<Command>
					<CommandInput placeholder={'Search users'} />
					<CommandEmpty>Nothing found.</CommandEmpty>
					<CommandList>
						{workers?.map((worker) => {
							const workerConversations =
								conversations?.filter((conversation) => conversation.agent === worker.sid) ?? [];
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

									<span>{workerAttributes.full_name}</span>
									<div className='flex items-center gap-1.5 ml-auto'>
										<Button
											variant='default'
											size='smIcon'
											className='ml-auto animate-pulse'
										>
											<Voicemail />
										</Button>

										<Button
											variant='default'
											size='smIcon'
											className='ml-auto animate-pulse'
										>
											<Phone />
										</Button>
									</div>

									{/* {workerConversations?.length > 0 && (
									)} */}
								</CommandItem>
							);
						})}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

type ActivityListItemProps = {
	worker: Worker;
	tasks: TaskInstance[];
};

const ActivityListItem = ({ worker, tasks }: ActivityListItemProps) => {
	const { worker: work } = useWorker();
	const workerAttributes = worker.attributes;
	const taskWithConference = tasks.find((task) => JSON.parse(task.attributes).conference.sid);
	// const addConferenceParticipantMutation = useMutation({
	// 	mutationFn: (params: CreateParticipantParams) => work.monitor,
	// });

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

			<span>{workerAttributes.full_name}</span>

			{tasks?.length > 0 && (
				<Button
					variant='default'
					size='smIcon'
					className='ml-auto animate-pulse'
				>
					<Volume2 />
				</Button>
			)}
		</CommandItem>
	);
};

export default ActivityItem;