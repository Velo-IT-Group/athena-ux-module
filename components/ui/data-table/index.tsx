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
	PaginationState,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { DataTablePagination } from './pagination';
import { DataTableToolbar, FacetedFilter } from './toolbar';
import { usePagination } from '@/hooks/usePagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

declare module '@tanstack/table-core' {
	interface TableMeta<TData extends RowData> {
		filterKey: keyof TData;
	}
}
interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	meta?: TableMeta<TData>;
	facetedFilters?: FacetedFilter<TData>[];
	hidePagination?: boolean;
	count: number;
	pageSize?: number;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	meta,
	facetedFilters,
	count,
	pageSize = 10,
	hidePagination = false,
}: DataTableProps<TData, TValue>) {
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const { limit, onPaginationChange, pagination } = usePagination();
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const pageCount = Math.round(count / limit);

	const createQueryString = React.useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);

			return params.toString();
		},
		[searchParams]
	);

	React.useEffect(() => {
		console.log(pagination, onPaginationChange, limit);
		router.push(pathname + '?' + createQueryString('page', `${pagination.pageIndex + 1}`));
	}, [createQueryString, pagination.pageIndex, pathname, router, searchParams]);

	React.useEffect(() => {
		router.push(pathname + '?' + createQueryString('pageSize', `${pagination.pageSize}`));
	}, [pagination.pageSize]);

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
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: !hidePagination ? getPaginationRowModel() : undefined,
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		manualPagination: true,
		onPaginationChange: onPaginationChange,
		rowCount: count,
		// pageCount: pageCount,
		meta,
	});

	return (
		<div className='space-y-3'>
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
				</Table>
			</div>

			{!hidePagination && <DataTablePagination table={table} />}
		</div>
	);
}
