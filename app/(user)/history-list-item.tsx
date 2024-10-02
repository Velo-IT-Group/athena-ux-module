'use client';
import { CommandItem } from '@/components/ui/command';
import { Skeleton } from '@/components/ui/skeleton';
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
	const { data, isLoading } = useQuery({
		queryKey: ['contact', conversation.contact_id],
		queryFn: () => getContact(conversation.contact_id, { fields: ['id', 'firstName', 'lastName', 'company'] }),
	});

	const name = data ? `${data?.firstName} ${data?.lastName ?? ''}` : undefined;
	const value = `${Object.values(data ? { ...data, company: data.company?.name } : {}).toString()} ${
		conversation.date
	}`;

	return (
		<CommandItem value={value}>
			{conversation.direction === 'outbound' ? (
				<PhoneOutgoing className='mr-3 text-red-500' />
			) : (
				<PhoneIncoming className='mr-3 text-green-500' />
			)}
			<div>
				{isLoading ? (
					<Skeleton className='h-2 w-5' />
				) : (
					<>
						{name && name}
						{name && ' • '}
					</>
				)}
				{parsePhoneNumber(conversation.phone_number ?? '').formattedNumber}
				<div>
					<span className='text-muted-foreground text-xs'>
						{Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(startTime)}
						{' - '}
						{conversation.talk_time
							? Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(
									addSeconds(startTime, conversation?.talk_time ?? 0)
							  )
							: 'Current'}
					</span>
				</div>
			</div>
		</CommandItem>
	);
};

export default HistoryListItem;
