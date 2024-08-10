import { buttonVariants } from '@/components/ui/button';
import { getTicket } from '@/lib/manage/read';
import Link from 'next/link';
import React from 'react';

type Props = {
	ticketId: number;
};

const ParentTicket = async ({ ticketId }: Props) => {
	const ticket = await getTicket(ticketId, { fields: ['id', 'summary'] });

	return (
		<div className='flex items-center text-sm text-muted-foreground'>
			<span className='text-nowrap'>Sub-ticket of</span>

			<Link
				href={`/tickets/${ticket.id}`}
				className={buttonVariants({ variant: 'ghost' })}
			>
				<span className='text-xs text-muted-foreground mr-1.5'>#{ticket.id}</span>
				<span className='text-ellipsis'>{ticket.summary}</span>
			</Link>
		</div>
	);
};

export default ParentTicket;
