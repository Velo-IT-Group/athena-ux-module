'use client';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTwilio } from '@/providers/twilio-provider';
import { useWorker } from '@/providers/worker-provider';
import { Activity } from 'twilio-taskrouter';
import ActivityItem from './activity-item';

type Props = {
	isCollapsed: boolean;
};

const SidebarActivityList = ({ isCollapsed }: Props) => {
	const [open, setOpen] = useState(false);
	const { currentWorkspace, workspace } = useTwilio();
	const { worker } = useWorker();
	const { data: workers } = useQuery({
		queryKey: ['workers'],
		queryFn: async () => {
			return await workspace?.fetchWorkers();
		},
		refetchInterval: open ? 1000 : 10000,
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
		refetchInterval: open ? 1000 : 10000,
	});

	console.log(tasks);
	const [activities, setActivities] = useState<Activity[]>([]);

	useEffect(() => {
		if (!worker) return;
		worker.on('ready', () => {
			setActivities(Array.from(worker.activities.values()));
		});
	}, [worker]);

	const workerArray = Array.from(workers?.values() ?? []);

	return (
		<div className='grid gap-1.5 px-1.5 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-1.5 group-[[data-collapsed=true]]:py-1.5'>
			{activities?.map((activity) => (
				<ActivityItem
					key={activity.sid}
					workers={workerArray.filter((worker) => worker.activitySid === activity.sid)}
					workspace={workspace!}
					activity={activity}
					isCollapsed={isCollapsed}
					onOpenChanges={setOpen}
				/>
			))}
		</div>
	);
};

export default SidebarActivityList;
