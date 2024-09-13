'use client';
import React from 'react';
import { CardContent } from '../ui/card';
import ParticipantListItem from './participant-list-item';
import { ConferenceParticpant } from '@/hooks/useTask';

type Props = {
	sid: string;
	participants: ConferenceParticpant;
};

const ActiveCallParticipants = ({ sid, participants }: Props) => {
	const entries = Object.entries(participants);

	return (
		<CardContent className='p-1.5 flex flex-col justify-start'>
			{entries.map(([key, value]) => {
				return (
					<ParticipantListItem
						key={key}
						conferenceSid={sid}
						name={value.name}
						sid={value.sid}
						isYou={key === 'worker'}
						showRemoval={entries.length > 2}
					/>
				);
			})}
		</CardContent>
	);
};

export default ActiveCallParticipants;
