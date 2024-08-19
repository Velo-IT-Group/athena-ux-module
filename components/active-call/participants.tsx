'use client';
import React, { useEffect, useState } from 'react';
import { CardContent } from '../ui/card';
import ParticipantListItem from './participant-list-item';
import { useSession } from 'next-auth/react';
import { useTask } from './context';

const ActiveCallParticipants = () => {
	const { task, setTask } = useTask();
	const { data } = useSession();
	const [participants, setParticipants] = useState<Record<string, string>>({});

	useEffect(() => {
		setParticipants({
			worker: data?.user?.name ?? 'You',
			customer: task?.attributes.name ?? task?.attributes.from,
		});
	}, [data, task]);

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
