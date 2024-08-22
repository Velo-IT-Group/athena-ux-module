'use client';
import React, { useEffect, useState } from 'react';
import { CardContent } from '../ui/card';
import ParticipantListItem from './participant-list-item';
import { useTask } from './context';
import { createClient } from '@/utils/supabase/client';

const ActiveCallParticipants = () => {
	const { task } = useTask();
	const supabase = createClient();

	const [participants, setParticipants] = useState<Record<string, string>>({});

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			setParticipants({
				worker: data?.user?.user_metadata?.name ?? 'You',
				customer: task?.attributes.name ?? task?.attributes.from,
			});
		});
	}, [task]);

	const entries = Object.entries(participants);

	return (
		<CardContent className='p-1.5 flex flex-col justify-start'>
			{entries.map(([key, value]) => (
				<ParticipantListItem
					key={key}
					name={value}
					sid={key}
					isYou={key === 'worker'}
				/>
			))}
		</CardContent>
	);
};

export default ActiveCallParticipants;
