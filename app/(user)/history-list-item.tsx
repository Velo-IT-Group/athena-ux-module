'use client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CommandItem } from '@/components/ui/command';
import { Skeleton } from '@/components/ui/skeleton';
import { getContact } from '@/lib/manage/read';
import { parsePhoneNumber } from '@/lib/utils';
import { addSeconds, relativeDate } from '@/utils/date';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, Compass, Hash, PhoneIncoming, PhoneOutgoing, Route, Smartphone, Undo2, User } from 'lucide-react';
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

	const name = data
		? `${data?.firstName} ${data?.lastName ?? ''}`
		: parsePhoneNumber(conversation.phone_number ?? '').formattedNumber;
	const value = `${Object.values(data ? { ...data, company: data.company?.name } : {}).toString()} ${
		conversation.date
	}`;

	return (
		<div className='flex flex-col items-center justify-center rounded-lg border bg-background p-3 w-full'>
			<div className='flex w-full items-center justify-start gap-x-2'>
				<div className='h-6 w-6 shrink-0 rounded-full border border-border/15 bg-[#FE9300] '></div>

				{isLoading ? <Skeleton className='h-3 w-7' /> : <span className='select-none text-sm font-medium'>{name}</span>}

				<Smartphone />

				<Compass />
			</div>
			<Accordion
				type='multiple'
				className='w-full'
			>
				<AccordionItem value='call-details'>
					<AccordionTrigger className='p-0'>
						<span className='mt-2 select-none text-sm text-muted-foreground'>Call Details </span>
					</AccordionTrigger>

					<AccordionContent className='grid grid-cols-2 gap-3 pt-3 text-sm'>
						<p className='text-muted-foreground flex items-center gap-1.5'>
							<Route className='w-3 h-3' /> <span>Route</span>
						</p>

						<p>{conversation.queue}</p>

						<p className='text-muted-foreground text-sm flex items-center gap-1.5'>
							<Undo2 className='w-3 h-3' /> <span>Previous Call</span>
						</p>

						<p>{relativeDate(startTime)}</p>

						<p className='text-muted-foreground text-sm flex items-center gap-1.5'>
							<User className='w-3 h-3' /> <span>Assignee</span>
						</p>

						<p className='text-ellipsis'>{conversation.agent}</p>

						<p className='text-muted-foreground text-sm flex items-center gap-1.5'>
							<Hash className='w-3 h-3' /> <span>Number</span>
						</p>

						<p>{parsePhoneNumber(conversation.phone_number ?? '').formattedNumber}</p>

						<p className='text-muted-foreground text-sm flex items-center gap-1.5'>
							<Briefcase className='w-3 h-3' /> <span>Company</span>
						</p>

						<p>{conversation.company_id}</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
		// <CommandItem value={value}>
		// {conversation.direction === 'outbound' ? (
		// 	<PhoneOutgoing className='mr-3 text-red-500' />
		// ) : (
		// 	<PhoneIncoming className='mr-3 text-green-500' />
		// )}
		// 	<div>
		// {isLoading ? (
		// 	<Skeleton className='h-2 w-5' />
		// ) : (
		// 	<>
		// 		{name && name}
		// 		{name && ' • '}
		// 	</>
		// )}
		// 		{parsePhoneNumber(conversation.phone_number ?? '').formattedNumber}
		// 	<div>
		// 		<span className='text-muted-foreground text-xs'>
		// 			{Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(startTime)}
		// 			{' - '}
		// 			{conversation.talk_time
		// 				? Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(
		// 						addSeconds(startTime, conversation?.talk_time ?? 0)
		// 				  )
		// 				: 'Current'}
		// 		</span>
		// 	</div>
		// </div>
		// </CommandItem>
	);
};

export default HistoryListItem;
