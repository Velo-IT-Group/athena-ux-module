'use client';
import React from 'react';
import { CardContent } from '../ui/card';
import ParticipantListItem from './participant-list-item';
import { useTaskContext } from './context';

const ActiveCallParticipants = () => {
	const { conferenceParticipants } = useTaskContext();
	const entries = Object.entries(conferenceParticipants ?? {});

	return (
		<CardContent className='p-1.5 flex flex-col justify-start'>
			{entries.map(([key, value]) => {
				return (
					<ParticipantListItem
						key={key}
						name={value.name}
						sid={value.sid}
						isYou={key === 'worker'}
						showRemoval={entries.length > 2}
						nameKey={key}
					/>
				);
			})}
		</CardContent>
	);
};

export default ActiveCallParticipants;
