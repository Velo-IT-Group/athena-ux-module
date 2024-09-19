'use client';
import { getTickets } from '@/lib/manage/read';
import { ServiceTicket } from '@/types/manage';
import { Conditions, generateParams } from '@/utils/manage/params';
import React from 'react';
import { DataTable } from '../ui/data-table';
import { columns } from '../table-columns/ticket';
import { Combobox } from '../ui/combobox';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FacetedFilter } from '../ui/data-table/toolbar';
import { TableDefinition } from '@/types';
import { useQuery } from '@tanstack/react-query';
import TableSkeleton from '../ui/data-table/skeleton';
import { baseHeaders } from '@/lib/utils';

type Props = {
	type: 'table' | 'combobox' | 'select';
	defaultValue?: number;
	params?: Conditions<ServiceTicket>;
	hidePagination?: boolean;
	facetedFilters?: FacetedFilter<ServiceTicket>[];
	definition: TableDefinition;
};

const TicketList = ({ type, defaultValue, params, definition, hidePagination = false, facetedFilters }: Props) => {
	// const queryClient = getQueryClient();
	// Note we are now using fetchQuery()
	// const { data, isFetching } = useQuery({
	// 	queryKey: ['tickets', params?.conditions, params?.page, params?.pageSize, params?.orderBy],
	// 	queryFn: async () => {
	// 		const [ticketResponse, countResponse] = await Promise.all([
	// 			fetch(`${process.env.NEXT_PUBLIC_CONNECT_WISE_URL}/service/tickets${generateParams(params)}`, {
	// 				headers: baseHeaders,
	// 			}),
	// 			fetch(`${process.env.NEXT_PUBLIC_CONNECT_WISE_URL}/service/tickets/count${generateParams(params)}`, {
	// 				headers: baseHeaders,
	// 			}),
	// 		]);

	// 		return {
	// 			tickets: await ticketResponse.json(),
	// 			count: (await countResponse.json()).count,
	// 		};
	// 	},
	// });

	return (
		<>
			{type === 'table' && (
				<DataTable
					initialData={[]}
					columns={columns}
					queryFn={getTickets(params)}
					facetedFilters={facetedFilters}
					count={0}
					isLoading={false}
					meta={{
						filterKey: 'summary',
						definition,
						filterParams: params!,
					}}
					hidePagination={hidePagination}
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
