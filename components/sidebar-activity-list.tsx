'use client';
import React, { Fragment, useEffect, useState } from 'react';
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
	const { workspace } = useTwilio();
	const { worker } = useWorker();

	const [open, setOpen] = useState(false);

	const { data: workers } = useQuery({
		queryKey: ['workers'],
		queryFn: () => workspace?.fetchWorkers({ Ordering: 'DateStatusChanged:desc' }),
		refetchInterval: open ? 1000 : 10000,
	});

	const { items } = useSyncMap('SyncTaskRouterTasks');
	const [activities, setActivities] = useState<Activity[]>([]);

	useEffect(() => {
		if (!worker) return;
		worker.on('ready', () => {
			setActivities(Array.from(worker.activities.values()));
		});
	}, [worker]);

	const workerArray = Array.from(workers?.values() ?? []);

	return (
		<Fragment>
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
		</Fragment>
	);
};

export default SidebarActivityList;
