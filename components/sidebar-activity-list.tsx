'use client';

import React, { useEffect, useState } from 'react';
import { Circle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Circle } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { faker } from '@faker-js/faker';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from './ui/command';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import useActivities from '@/hooks/useActivities';
import { useQuery } from '@tanstack/react-query';
import { SyncClient } from 'twilio-sync';
import { useTwilio } from '@/providers/twilio-provider';
import { useWorker } from '@/providers/worker-provider';
import { Activity, Workspace } from 'twilio-taskrouter';

type Props = {
	isCollapsed: boolean;
};

const SidebarActivityList = ({ isCollapsed }: Props) => {
	const { worker } = useWorker();
	const { token, currentWorkspace } = useTwilio();
	const workspace = new Workspace(token, {}, currentWorkspace);
	const client = new SyncClient(token);
	const { data: workers } = useQuery({
		queryKey: ['workers'],
		queryFn: async () => {
			return await workspace.fetchWorkers();
		},
	});
	const { data: tasks } = useQuery({
		queryKey: ['tasks'],
		queryFn: async () => {
			const response = await fetch(
				`https://taskrouter.twilio.com/v1/Workspaces/${currentWorkspace}/Tasks?PageSize=20`,
				{
					headers: {
						Authorization: `Basic ${btoa(`${process.env.TWILIO_API_KEY_SID}:${process.env.TWILIO_API_KEY_SECRET}`)}`,
					},
					next: {
						tags: ['tasks'],
					},
				}
			);
			const data = await response.json();
			console.log(data);
			return data.tasks;
		},
	});

	console.log(tasks);
	const [activities, setActivities] = useState<Activity[]>([]);
	const { currentActivity, updateActivity } = useActivities();

	const activityColors: Record<string, string> = {
		Available: 'bg-green-500',
		Unavailable: 'bg-red-500',
		Offline: 'bg-gray-500',
	};

	useEffect(() => {
		if (!worker) return;
		worker.on('ready', () => {
			setActivities(Array.from(worker.activities.values()));
		});
	}, [worker]);

	useEffect(() => {
		if (!token) return;
		client.map('MP1e3faac1170162288e048012702a2c2a').then((map) => {
			map.getItems({ limit: 1, order: 'desc' }).then(({ items }) => {
				// setCumulativeStatsVoice((items[0].data as any)?.['cumulativeStats_voice']);
			});

			map.on('itemUpdated', (data) => {
				// console.log(data);
			});
		});
	}, [token]);

	const workerArray = Array.from(workers?.values() ?? []);

	useEffect(() => {
		if (!worker) return;
		worker.on('ready', () => {
			setActivities(Array.from(worker.activities.values()));
		});
	}, [worker]);

	useEffect(() => {
		if (!token) return;
		client.map('').then((map) => {
			map.getItems({ limit: 1, order: 'desc' }).then(({ items }) => {
				// setCumulativeStatsVoice((items[0].data as any)?.['cumulativeStats_voice']);
			});

			map.on('itemUpdated', (data) => {
				// console.log(data);
			});
		});
	}, [token]);

	const workerArray = Array.from(workers?.values() ?? []);

	return (
		<div className='grid gap-1.5 px-1.5 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-1.5 group-[[data-collapsed=true]]:py-1.5'>
			{activities?.map((activity) => (
				<Popover key={activity.sid}>
					<Tooltip delayDuration={0}>
						<TooltipTrigger asChild>
							<PopoverTrigger asChild>
								<Button
									variant='ghost'
									size={isCollapsed ? 'icon' : 'sm'}
									className={isCollapsed ? 'h-9 w-9' : 'justify-start'}
									size={isCollapsed ? 'icon' : 'sm'}
									className={isCollapsed ? 'h-9 w-9' : 'justify-start'}
								>
									<Circle
										className={cn('stroke-none rounded-full', activityColors[activity.name], !isCollapsed && 'mr-1.5')}
									/>
									<span className={cn(isCollapsed && 'sr-only')}>{activity.name}</span>
									<Circle
										className={cn('stroke-none rounded-full', activityColors[activity.name], !isCollapsed && 'mr-1.5')}
									/>
									<span className={cn(isCollapsed && 'sr-only')}>{activity.name}</span>
								</Button>
							</PopoverTrigger>
						</TooltipTrigger>

						<TooltipContent side='right'>
							{activity.name} ({workerArray.filter((worker) => worker.activitySid === activity.sid).length})
						</TooltipContent>
						<TooltipContent side='right'>
							{activity.name} ({workerArray.filter((worker) => worker.activitySid === activity.sid).length})
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
								{workerArray
									?.filter((worker) => worker.activitySid === activity.sid)
									?.map((user) => (
										<CommandItem
											key={user.sid}
											value={user.attributes.full_name}
											className='flex items-center gap-1.5'
										>
											<Avatar className='w-3.5 h-3.5'>
												<AvatarFallback className='w-3.5 h-3.5'>{user.attributes.full_name.charAt(0)}</AvatarFallback>
												<AvatarImage
													className='w-3.5 h-3.5'
													src={user.attributes.imageUrl}
												/>
											</Avatar>
											{workerArray
												?.filter((worker) => worker.activitySid === activity.sid)
												?.map((user) => (
													<CommandItem
														key={user.sid}
														value={user.attributes.full_name}
														className='flex items-center gap-1.5'
													>
														<Avatar className='w-3.5 h-3.5'>
															<AvatarFallback className='w-3.5 h-3.5'>
																{user.attributes.full_name.charAt(0)}
															</AvatarFallback>
															<AvatarImage
																className='w-3.5 h-3.5'
																src={user.attributes.imageUrl}
															/>
														</Avatar>

														<span>{user.attributes.full_name}</span>
														<span>{user.attributes.full_name}</span>

														{/* {user.isOnCall && (
												<Button
													variant='default'
													size='smIcon'
													className='ml-auto animate-pulse'
												>
													<Phone />
												</Button>
											)} */}
													</CommandItem>
												))}
											{/* {user.isOnCall && (
												<Button
													variant='default'
													size='smIcon'
													className='ml-auto animate-pulse'
												>
													<Phone />
												</Button>
											)} */}
										</CommandItem>
									))}
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			))}
		</div>
	);
};

export default SidebarActivityList;
