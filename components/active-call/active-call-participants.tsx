import { getConferenceParticipants } from '@/lib/twilio/conference/helpers';
import React, { Suspense } from 'react';
import { CardContent } from '../ui/card';
import ParticipantListItem from './participant-list-item';

type Props = {
	conferenceSid: string;
};

const ActiveCallParticipants = async ({ conferenceSid }: Props) => {
	const participants = await getConferenceParticipants(conferenceSid);

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
