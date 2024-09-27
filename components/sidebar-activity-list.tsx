'use client';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTwilio } from '@/providers/twilio-provider';
import { useWorker } from '@/providers/worker-provider';
import { Activity } from 'twilio-taskrouter';
import ActivityItem from './activity-item';
import { createClient } from '@/utils/supabase/client';

type Props = {
	isCollapsed: boolean;
};

const SidebarActivityList = ({ isCollapsed }: Props) => {
	const supabase = createClient();

	const { workspace } = useTwilio();
	const { worker } = useWorker();

	const [open, setOpen] = useState(false);
	const [conversations, setConversations] = useState<Conversation[]>([]);

	const { data: workers } = useQuery({
		queryKey: ['workers'],
		queryFn: () => workspace?.fetchWorkers(),
		refetchInterval: open ? 1000 : 10000,
	});

	const { data } = useQuery({
		queryKey: ['conversations'],
		queryFn: async () => {
			console.log('running');
			return await supabase
				.schema('reporting')
				.from('conversations')
				.select()
				.is('talk_time', null)
				.is('abandoned', null);
		},
	});

	useEffect(() => {
		if (!data) {
			setConversations([]);
			return;
		}

		setConversations(data?.data as unknown as Conversation[]);
	}, [data]);

	const [activities, setActivities] = useState<Activity[]>([]);

	useEffect(() => {
		if (!worker) return;
		worker.on('ready', () => {
			setActivities(Array.from(worker.activities.values()));
		});
	}, [worker]);

	useEffect(() => {
		// setConversations(initalConversations);

		const channel = supabase
			.channel('realtime_conversations')
			.on('postgres_changes', { event: 'INSERT', schema: 'reporting', table: 'conversations' }, (payload) => {
				console.log({ payload });
				const newItem = payload.new as Conversation;
				setConversations((prev) => [...prev.filter((c) => c.id !== newItem.id), newItem]);
			})
			.on('postgres_changes', { event: 'UPDATE', schema: 'reporting', table: 'conversations' }, (payload) => {
				console.log({ payload });
				const newItem = payload.new as Conversation;
				setConversations((prev) => [...prev.filter((c) => c.id !== newItem.id), newItem]);
			})
			.subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, []);

	const workerArray = Array.from(workers?.values() ?? []);

	return (
		<div className='grid gap-1.5 mx-1.5 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:mx-1.5 group-[[data-collapsed=true]]:py-1.5'>
			{/* <pre>{JSON.stringify(conversations, null, 2)}</pre> */}
			{activities?.map((activity) => (
				<ActivityItem
					key={activity.sid}
					workers={workerArray.filter((worker) => worker.activitySid === activity.sid)}
					conversations={conversations}
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
