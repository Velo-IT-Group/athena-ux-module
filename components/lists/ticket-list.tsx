import { getAllTickets } from '@/lib/manage/read';
import { ServiceTicket } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import React from 'react';
import { DataTable } from '../ui/data-table';
import { columns } from '../table-columns/ticket';
import { Combobox } from '../ui/combobox';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FacetedFilter } from '../ui/data-table/toolbar';

type Props = {
	type: 'table' | 'combobox' | 'select';
	defaultValue?: number;
	params?: Conditions<ServiceTicket>;
	hidePagination?: boolean;
	facetedFilters?: FacetedFilter<ServiceTicket>[];
};

const TicketList = async ({ type, defaultValue, params, hidePagination = false, facetedFilters }: Props) => {
	const { tickets, count } = await getAllTickets(params);

	return (
		<>
			{type === 'table' && (
				<DataTable
					data={tickets}
					columns={columns}
					facetedFilters={facetedFilters}
					count={count}
					meta={{ filterKey: 'summary' }}
					hidePagination={hidePagination}
				/>
			)}

			{type === 'combobox' && (
				// @ts-ignore
				<Combobox
					items={tickets.map((ticket) => {
						return { label: ticket.summary, value: `${ticket.id}-${ticket.summary}` };
					})}
					placeholder='Select a ticket...'
					value={String(defaultValue)}
					// setValue={() => {}}
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
