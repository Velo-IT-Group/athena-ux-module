'use client';
import { getConferenceParticipants } from '@/lib/twilio/conference/helpers';
import React, { Suspense, useEffect, useState } from 'react';
import { CardContent } from '../ui/card';
import ParticipantListItem from './participant-list-item';
import { ParticipantInstance } from 'twilio/lib/rest/api/v2010/account/conference/participant';

type Props = {
	conferenceSid: string;
};

const ActiveCallParticipants = ({ conferenceSid }: Props) => {
	const [participants, setParticipants] = useState<ParticipantInstance[]>([]);

	useEffect(() => {
		const headers = new Headers();
		headers.append(
			'Authorization',
			`Basic ${btoa(process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID + ':' + process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN)}`
		);
		fetch(
			`https://api.twilio.com/2010-04-01/Accounts/${process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID}/Conferences/${conferenceSid}/Participants.json`,
			{ headers }
		)
			.then((data) => data.json())
			.then(({ participants }) => {
				console.log(participants);
				setParticipants(participants);
			})
			.catch(console.error);
	}, [conferenceSid]);

	console.log(participants);

	return (
		<Suspense>
			<CardContent className='p-1.5'>
				{participants.map((participant) => (
					<ParticipantListItem
						key={participant.accountSid}
						participant={participant}
					/>
				))}
			</CardContent>
		</Suspense>
	);
};

export default ActiveCallParticipants;
