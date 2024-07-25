import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getTickets, getTriageTickets } from '@/lib/manage/read';
import Link from 'next/link';
import React from 'react';

type Props = {};

const Page = async (props: Props) => {
	const tickets = await getTriageTickets();

	return (
		<main>
			<header>
				<h1 className='text-lg font-semibold'>Tickets</h1>
			</header>

			<section>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Company</TableHead>
							<TableHead>Summary</TableHead>
							<TableHead>Priority</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{tickets.map((ticket) => (
							<Link
								className='table-row border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'
								style={{ verticalAlign: 'inherit', unicodeBidi: 'isolate' }}
								href={`/tickets/${ticket.id}`}
								key={ticket.id}
							>
								<TableCell className='border-r'>#{ticket.id}</TableCell>

								<TableCell className='border-r'>{ticket.status?.name}</TableCell>

								<TableCell className='border-r'>{ticket.company?.name}</TableCell>

								<TableCell className='border-r max-w-[500px]'>
									<span className='line-clamp-1'>{ticket.summary}</span>
								</TableCell>

								<TableCell>{ticket.priority?.name}</TableCell>
							</Link>
						))}
					</TableBody>
				</Table>
			</section>
		</main>
	);
};

export default Page;
