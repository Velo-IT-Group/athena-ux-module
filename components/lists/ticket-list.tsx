'use client';

import React from 'react';
import { getTickets } from '@/lib/manage/read';
import { ServiceTicket } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import { DataTable } from '../ui/data-table';
import { columns } from '../table-columns/ticket';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FacetedFilter } from '../ui/data-table/toolbar';
import { TableDefinition } from '@/types';

type Props = {
	type: 'table' | 'combobox' | 'select';
	defaultValue?: number;
	params?: Conditions<ServiceTicket>;
	hidePagination?: boolean;
	facetedFilters?: FacetedFilter<ServiceTicket | undefined>[];
	definition: TableDefinition;
};

const TicketList = ({ type, defaultValue, params, definition, hidePagination = false, facetedFilters }: Props) => {
	return (
		<>
			{type === 'table' && (
				<DataTable
					columns={columns}
					queryFn={getTickets}
					facetedFilters={facetedFilters}
					booleanFilters={[{ accessoryKey: 'closedFlag', title: 'Show All Tickets', defaultValue: false }]}
					meta={{
						filterKey: 'summary',
						definition,
						filterParams: params!,
					}}
					defaultVisibleColumns={{ priority: false, owner: false }}
				/>
			)}

			{type === 'combobox' && (
				// @ts-ignore
				// <Combobox
				// 	items={data?.tickets.map((ticket) => {
				// 		return { label: ticket.summary, value: `${ticket.id}-${ticket.summary}` };
				// 	})}
				// 	placeholder='Select a ticket...'
				// 	value={String(defaultValue)}
				// 	// setValue={() => {}}
				// />
				<></>
			)}

			{type === 'select' && (
				<Select defaultValue={String(defaultValue)}>
					<SelectTrigger>
						<SelectValue placeholder='Select a ticket...' />
					</SelectTrigger>

					<SelectContent>
						<SelectGroup>
							{/* @ts-ignore */}
							{data?.tickets.map((ticket) => (
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
