'use client';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTwilio } from '@/providers/twilio-provider';
import { useWorker } from '@/providers/worker-provider';
import { Activity } from 'twilio-taskrouter';
import ActivityItem from './activity-item';
import useSyncMap from '@/hooks/useSyncMap';

type Props = {
	isCollapsed: boolean;
};

const SidebarActivityList = ({ isCollapsed }: Props) => {
	'use no memo';
	const { workspace } = useTwilio();
	const { worker } = useWorker();

	const [open, setOpen] = useState(false);

	const { data: workers } = useQuery({
		queryKey: ['workers'],
		queryFn: () => workspace?.fetchWorkers(),
		refetchInterval: open ? 1000 : 10000,
	});

	const { items } = useSyncMap('SyncTaskRouterTasks');
	// console.log(items);
	const [activities, setActivities] = useState<Activity[]>([]);

	useEffect(() => {
		if (!worker) return;
		worker.on('ready', () => {
			setActivities(Array.from(worker.activities.values()));
		});
	}, [worker]);

	const workerArray = Array.from(workers?.values() ?? []);

	return (
		<div className='grid gap-1.5 mx-1.5 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:mx-1.5 group-[[data-collapsed=true]]:py-1.5'>
			{activities?.map((activity) => (
				<ActivityItem
					key={activity.sid}
					workers={workerArray.filter((worker) => worker.activitySid === activity.sid)}
					currentActivity={worker?.activity}
					conversations={items}
					activity={activity}
					isCollapsed={isCollapsed}
				/>
			))}
		</div>
	);
};

export default SidebarActivityList;
