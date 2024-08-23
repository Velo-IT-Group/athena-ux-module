'use client';
import React from 'react';
import { CardContent } from '../ui/card';
import ParticipantListItem from './participant-list-item';
import { ConferenceParticpant } from '@/hooks/useTask';

type Props = {
	participants: ConferenceParticpant;
};

const ActiveCallParticipants = ({ participants }: Props) => {
	const entries = Object.entries(participants);

	return (
		<CardContent className='p-1.5 flex flex-col justify-start'>
			{entries.map(([key, value]) => (
				<ParticipantListItem
					key={key}
					name={value.name}
					sid={value.sid}
					isYou={key === 'worker'}
				/>
			))}
		</CardContent>
	);
};

export default ActiveCallParticipants;
