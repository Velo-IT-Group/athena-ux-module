import { useWorker } from '@/providers/worker-provider';
import { useEffect, useState } from 'react';
import { Activity } from 'twilio-taskrouter';

const useActivities = () => {
	const [activities, setActivities] = useState<Activity[]>([]);
	const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
	const { worker } = useWorker();

	useEffect(() => {
		if (!worker) return;
		setActivities(Array.from(worker.activities.values()));
		setCurrentActivity(worker.activity);
	}, [worker]);

	async function updateActivity(activity: Activity) {
		setCurrentActivity(activity);
		await activity.setAsCurrent();
	}

	return { activities, currentActivity, updateActivity };
};

export default useActivities;
