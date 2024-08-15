'use client';
import React, { useEffect, useState } from 'react';
import { CardContent } from '../ui/card';
import ParticipantListItem from './participant-list-item';
import { useSession } from 'next-auth/react';

type Props = {
	conferenceSid: string;
	customerName: string;
};

const ActiveCallParticipants = ({ conferenceSid, customerName }: Props) => {
	const { data } = useSession();
	console.log(data);
	const [participants, setParticipants] = useState<Record<string, string>>({});

	useEffect(() => {
		setParticipants({
			worker: data?.user?.name ?? 'You',
			customer: customerName,
		});
	}, [customerName, data]);

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
