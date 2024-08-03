'use client';
import React from 'react';
import { ParticipantInstance } from 'twilio/lib/rest/api/v2010/account/conference/participant';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';

type Props = { participant: ParticipantInstance };

const ParticipantListItem = ({ participant }: Props) => {
	return (
		<Button
			variant='ghost'
			size='sm'
		>
			<Avatar>
				<AvatarFallback>NB</AvatarFallback>
			</Avatar>

			<span className='text-sm text-muted-foreground'>{participant.accountSid}</span>
		</Button>
	);
};

export default ParticipantListItem;
