'use client';

import * as React from 'react';
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

import { DataTablePagination } from './pagination';
import { DataTableToolbar, FacetedFilter } from './toolbar';
import { usePagination } from '@/hooks/usePagination';
import { TableDefinition } from '@/types';
import { Conditions } from '@/utils/manage/params';
import TableSkeleton from './skeleton';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { updateFilterCookie } from '@/components/cookie-filter-actions';
declare module '@tanstack/table-core' {
	interface TableMeta<TData extends RowData> {
		filterKey: keyof TData;
		definition: TableDefinition;
		filterParams: Conditions<TData>;
	}
}
interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	initialData: TData[];
	meta: TableMeta<TData>;
	facetedFilters?: FacetedFilter<TData>[];
	hidePagination?: boolean;
	count: number;
	queryFn: QueryFunction<TData[]>;
	defaultVisibleColumns?: VisibilityState;
}

export function DataTable<TData, TValue>({
	columns,
	initialData,
	meta,
	count,
	facetedFilters,
	hidePagination = false,
	queryFn,
	defaultVisibleColumns = {},
}: DataTableProps<TData, TValue>) {
	const [params, setParams] = React.useState<Conditions<TData>>(meta.filterParams ?? {});
	const { pagination, onPaginationChange } = usePagination(meta.definition, meta.filterParams);
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(defaultVisibleColumns);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const { data, isLoading, isFetching, refetch } = useQuery({
		queryKey: [params, pagination],
		queryFn: queryFn,
		initialData,
		enabled: false,
	});

	console.log(data);

	React.useEffect(() => {
		refetch();
	}, [params, pagination]);

	React.useEffect(() => {
		return () => {
			updateFilterCookie(meta.definition, { ...params, pageSize: pagination.pageSize, page: pagination.pageIndex });
		};
	}, []);

	const table = useReactTable({
		data,
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
		rowCount: count,
		getPaginationRowModel: !hidePagination ? getPaginationRowModel() : undefined,
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		meta,
	});

	return (
		<div className='space-y-3 p-[4px] overflow-x-auto overflow-visible'>
			<DataTableToolbar
				table={table}
				facetedFilters={facetedFilters}
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

					{isFetching || isLoading ? (
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

			{!hidePagination && <DataTablePagination table={table} />}
		</div>
	);
}
