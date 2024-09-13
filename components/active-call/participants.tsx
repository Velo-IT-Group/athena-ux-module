'use client';
import React from 'react';
import { CardContent } from '../ui/card';
import ParticipantListItem from './participant-list-item';
import { ConferenceParticpant } from '@/hooks/useTask';
import { useQuery } from '@tanstack/react-query';
import { getConferenceParticipants } from '@/lib/twilio/conference/helpers';

type Props = {
	sid: string;
	participants: ConferenceParticpant;
};

const ActiveCallParticipants = ({ sid, participants }: Props) => {
	const entries = Object.entries(participants);
	const { data, error, isLoading } = useQuery({
		queryKey: ['queryParticipants', sid],
		queryFn: () => getConferenceParticipants(sid),
	});

	// console.log(data);

	return (
		<CardContent className='p-1.5 flex flex-col justify-start'>
			{entries.map(([key, value]) => (
				<ParticipantListItem
					key={key}
					conferenceSid={sid}
					name={value.name}
					sid={value.sid}
					isYou={key === 'worker'}
					showRemoval={entries.length > 2}
				/>
			))}
		</CardContent>
	);
};

export default ActiveCallParticipants;
