import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ServiceTicket } from '@/lib/manage/types';
import { Card, CardContent } from '@/components/ui/card';

type Props = {
	tickets: ServiceTicket[];
};

const TicketList = ({ tickets }: Props) => {
	console.log(tickets);
	return (
		<Card>
			<CardContent className='p-3'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{tickets.map((ticket) => (
							<TableRow key={ticket.id}>
								<TableCell>{ticket.id}</TableCell>
								<TableCell>{ticket.summary}</TableCell>
								<TableCell>{ticket.status?.name}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};

export default TicketList;
