import { getBoards, getTickets } from '@/lib/manage/read';
import { ServiceTicket } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import React from 'react';
import { DataTable } from '../ui/data-table';
import { columns } from '../table-columns/ticket';
import { Combobox } from '../ui/combobox';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Props = {
	type: 'table' | 'combobox' | 'select';
	defaultValue?: number;
	params?: Conditions<ServiceTicket>;
	hidePagination?: boolean;
};

const TicketList = async ({ type, defaultValue, params, hidePagination = false }: Props) => {
	const [{ tickets, count }, boards] = await Promise.all([
		getTickets(params),
		getBoards({ orderBy: { key: 'name' }, pageSize: 1000 }),
	]);

	return (
		<>
			{type === 'table' && (
				<DataTable
					data={tickets}
					columns={columns}
					// facetedFilters={[{ accessoryKey: 'board', items: boards }]}
					count={count}
					meta={{ filterKey: 'summary' }}
					hidePagination={hidePagination}
				/>
			)}

			{type === 'combobox' && (
				<Combobox
					items={tickets.map((ticket) => {
						return { label: ticket.summary, value: `${ticket.id}-${ticket.summary}` };
					})}
					placeholder='Select a ticket...'
					value={String(defaultValue)}
					setValue={() => {}}
				/>
			)}

			{type === 'select' && (
				<Select defaultValue={String(defaultValue)}>
					<SelectTrigger>
						<SelectValue placeholder='Select a ticket...' />
					</SelectTrigger>

					<SelectContent>
						<SelectGroup>
							{tickets.map((ticket) => (
								<SelectItem
									key={ticket.id}
									value={String(ticket.id)}
								>
									{ticket.summary}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			)}
		</>
	);
};

export default TicketList;
