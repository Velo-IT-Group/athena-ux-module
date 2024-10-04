'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { CardContent } from '../ui/card';
import ParticipantListItem, { Participant } from './participant-list-item';
import { useTaskContext } from './context';
import useSyncMap from '@/hooks/useSyncMap';
import { ParticipantInstance, ParticipantListInstance } from 'twilio/lib/rest/api/v2010/account/conference/participant';

const ActiveCallParticipants = () => {
	const { conferenceParticipants, task } = useTaskContext();
	const entries = useMemo(() => Object.entries(conferenceParticipants ?? {}), [conferenceParticipants]);
	const { items } = useSyncMap(`Conference-${task?.sid}`);

	console.log(items);

	return (
		<CardContent className='p-1.5 flex flex-col justify-start'>
			{entries.map(([key, value]) => {
				const data = items.find((i) => i.data.AccountSid === value)?.data as ParticipantInstance;
				console.log(data);
				return (
					<ParticipantListItem
						key={key}
						participantType={key as Participant}
						sid={value}
						showRemoval={entries.length > 2}
					/>
				);
			})}
			{/* {items.map((item) => {
				const data = item.data as ParticipantInstance;

				return (
					<ParticipantListItem
						key={data.AccountSid}
						participantType={'customer'}
						sid={data.AccountSid}
						showRemoval={items.length > 2}
					/>
				);
			})} */}
		</CardContent>
	);
};

export default ActiveCallParticipants;
