'use client';
import React, { useEffect } from 'react';
import { getBoards, getContacts, getPriorities, getSystemMembers, getTickets } from '@/lib/manage/read';
import { ServiceTicket } from '@/types/manage';
import { Conditions, generateParams } from '@/utils/manage/params';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/table-columns/ticket';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTableToolbar, FacetedFilter } from '@/components/ui/data-table/toolbar';
import { TableDefinition } from '@/types';
import { useQuery } from '@tanstack/react-query';
import TableSkeleton from '@/components/ui/data-table/skeleton';
import { baseHeaders } from '@/lib/utils';
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	TableMeta,
	RowData,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { DataTablePagination } from './ui/data-table/pagination';
import { usePagination } from '@/hooks/usePagination';
import { updateFilterCookie } from './cookie-filter-actions';

type Props = {
	initialData: { tickets: ServiceTicket[]; count: number };
	defaultParams?: Conditions<ServiceTicket>;
	definition: TableDefinition;
};

const TicketTable = ({ initialData, defaultParams, definition }: Props) => {
	const [params, setParams] = React.useState<Conditions<ServiceTicket>>(defaultParams ?? {});
	const { pagination, onPaginationChange } = usePagination(definition, defaultParams ?? {});
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const { data, isLoading, isFetching, isPending, error, refetch } = useQuery({
		queryKey: ['tickets', params],
		queryFn: ({}) =>
			getTickets({
				...params,
				page: pagination.pageIndex + 1,
				pageSize: pagination.pageSize,
				orderBy: { key: 'id', order: 'desc' },
				// fields: Object.keys(columnVisibility),
			}),
		initialData,
		enabled: false,
	});

	useEffect(() => {
		refetch();
	}, [params, pagination]);

	useEffect(() => {
		return () => {
			updateFilterCookie(definition, { ...params, pageSize: pagination.pageSize, page: pagination.pageIndex });
		};
	}, []);

	const table = useReactTable({
		data: data.tickets,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onPaginationChange,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		manualPagination: true,
		rowCount: data?.count ?? 0,
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		meta: {
			filterKey: 'summary',
			definition,
			filterParams: params!,
		},
	});

	return (
		<div className='space-y-3 p-[4px] overflow-x-auto overflow-visible'>
			<DataTableToolbar
				table={table}
				facetedFilters={[]}
			/>

			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											colSpan={header.colSpan}
										>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>

					{isFetching || isPending || isLoading ? (
						<TableSkeleton
							columns={table.getHeaderGroups()[0].headers.length}
							rows={pagination.pageSize}
						/>
					) : (
						<TableBody className='overflow-x-auto'>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && 'selected'}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className='h-24 text-center'
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					)}
				</Table>
			</div>

			<DataTablePagination table={table} />
		</div>
		// <DataTable
		// 	data={data?.tickets ?? []}
		// 	columns={columns}
		// 	count={data?.count ?? 0}
		// 	isLoading={isFetching}
		// 	facetedFilters={[
		// 		{ accessoryKey: 'board', items: [], queryFn: () => getBoards() },
		// 		{ accessoryKey: 'priority', items: [], queryFn: () => getPriorities() },
		// 		{
		// 			accessoryKey: 'contact',
		// 			items: [],
		// 			queryFn: () => getContacts(),
		// 		},
		// 		{
		// 			accessoryKey: 'owner',
		// 			items: [],
		// 			queryFn: () => getSystemMembers(),
		// 		},
		// 	]}
		// 	meta={{
		// 		filterKey: 'summary',
		// 		definition,
		// 		filterParams: params!,
		// 	}}
		// 	defaultVisibleColumns={{ priority: false }}
		// />
	);
};

export default TicketTable;
