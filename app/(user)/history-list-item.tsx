'use client';
import { CommandItem } from '@/components/ui/command';
import { PhoneIncoming, PhoneOutgoing } from 'lucide-react';
import React from 'react';
import type { CallInstance } from 'twilio/lib/rest/api/v2010/account/call';

type Props = {
	call: CallInstance;
};

const HistoryListItem = ({ call }: Props) => {
	return (
		<CommandItem
			key={call.sid}
			value={call.sid}
			onSelect={(currentValue) => {
				console.log(currentValue);
			}}
		>
			{call.direction === 'outbound' ? (
				<PhoneOutgoing className='mr-1.5 text-red-500' />
			) : (
				<PhoneIncoming className='mr-1.5 text-green-500' />
			)}
			<span className='text-muted-foreground'>
				{call.fromFormatted} ({Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(new Date(call.dateCreated))})
			</span>
		</CommandItem>
	);
};

export default HistoryListItem;
