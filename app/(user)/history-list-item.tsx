'use client';
import { CommandItem } from '@/components/ui/command';
import { getContact } from '@/lib/manage/read';
import { parsePhoneNumber } from '@/lib/utils';
import { addSeconds } from '@/utils/date';
import { useQuery } from '@tanstack/react-query';
import { PhoneIncoming, PhoneOutgoing } from 'lucide-react';
import React from 'react';

type Props = {
	conversation: Conversation;
};

const HistoryListItem = ({ conversation }: Props) => {
	const startTime = new Date(conversation.date);
	const endTime = addSeconds(startTime, conversation?.talk_time ?? 0);
	const { data } = useQuery({
		queryKey: ['contact', conversation.contact_id],
		// @ts-ignore
		queryFn: () => getContact(conversation.contact_id, { fields: ['id', 'firstName', 'lastName', 'company/name'] }),
	});

	const name = data ? `${data?.firstName} ${data?.lastName ?? ''}` : undefined;
	const value = `${Object.values(data ? { ...data, company: data.company?.name } : {}).toString()} ${
		conversation.date
	}`;

	return (
		<CommandItem
			key={conversation.id}
			value={value}
		>
			{conversation.direction === 'outbound' ? (
				<PhoneOutgoing className='mr-3 text-red-500' />
			) : (
				<PhoneIncoming className='mr-3 text-green-500' />
			)}
			<div>
				{name && name}
				{name && ' • '}
				{parsePhoneNumber(conversation.phone_number ?? '').formattedNumber}
				<div>
					<span className='text-muted-foreground text-xs'>
						{Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(startTime)}
						{' - '}
						{Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(endTime)}
					</span>
				</div>
			</div>
		</CommandItem>
	);
};

export default HistoryListItem;
