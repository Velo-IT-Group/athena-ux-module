'use client';
import React from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';

type Props = { sid: string; name: string; isYou: boolean };

const ParticipantListItem = ({ sid, name, isYou }: Props) => {
	return (
		<Button
			variant='ghost'
			size='sm'
			className='justify-start gap-1.5'
		>
			<Avatar className='h-3.5 w-3.5'>
				<AvatarFallback className='text-[9px]'>NB</AvatarFallback>
			</Avatar>

			<p className='text-sm text-muted-foreground'>
				{name} {isYou && <span className='text-xs font-medium'>You</span>}
			</p>
		</Button>
	);
};

export default ParticipantListItem;
