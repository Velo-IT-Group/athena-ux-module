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
import { BooleanFilter, DataTableToolbar, FacetedFilter } from './toolbar';
import { TableDefinition } from '@/types';
import { Conditions } from '@/utils/manage/params';
import TableSkeleton from './skeleton';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { updateFilterCookie } from '@/components/cookie-filter-actions';
import { useFilterParameters } from '@/hooks/useFilterParameters';
import { ParameterFeature } from '@/types/table';
import { toast } from 'sonner';
declare module '@tanstack/table-core' {
	interface TableMeta<TData extends RowData> {
		filterKey: keyof TData;
		definition: TableDefinition;
		filterParams: Conditions<TData>;
	}
}

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	meta: TableMeta<TData>;
	facetedFilters?: FacetedFilter<TData>[];
	booleanFilters?: BooleanFilter<TData>[];
	hidePagination?: boolean;
	queryFn: (params: Conditions<TData>) => Promise<{ data: TData[]; count: number }>;
	defaultVisibleColumns?: VisibilityState;
}

export function DataTable<TData, TValue>({
	columns,
	meta,
	facetedFilters,
	booleanFilters,
	hidePagination = false,
	queryFn,
	defaultVisibleColumns = {},
}: DataTableProps<TData, TValue>) {
	const { parameters, onParametersChange, pagination, onPaginationChange } = useFilterParameters(
		meta.filterParams ?? {}
	);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(defaultVisibleColumns);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const { data, isLoading, isFetching, error, refetch, isRefetching } = useQuery({
		queryKey: [parameters, pagination],
		queryFn: ({ queryKey }) =>
			queryFn({ ...queryKey[0], page: pagination.pageIndex + 1, pageSize: pagination.pageSize }),
		placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
	});

	React.useEffect(() => {
		if (!meta.filterParams) return;
		onParametersChange(meta.filterParams);
	}, [meta.filterParams]);

	React.useEffect(() => {
		refetch();
	}, [pagination]);

	if (error) {
		console.error(error);
		toast.error(error.message);
	}

	React.useEffect(() => {
		return () => {
			updateFilterCookie(meta.definition, { ...parameters, pageSize: pagination.pageSize, page: pagination.pageIndex });
		};
	}, []);

	const table = useReactTable({
		_features: [ParameterFeature], //pass the new feature to merge with all of the built-in features under the hood
		data: data?.data ?? [],
		columns,
		state: {
			sorting,
			columnVisibility,
			columnFilters,
			pagination,
			parameters,
		},
		onParameterChange: onParametersChange,
		onSortingChange: setSorting,
		onPaginationChange,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		manualPagination: true,
		rowCount: data?.count ?? 0,
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
				booleanFilters={booleanFilters}
				refetch={refetch}
				isRefetching={isRefetching}
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

			{/* <div className='flex items-center gap-3 fixed bottom-2 left-auto right-auto bg-secondary/50 backdrop-blur-md border rounded-lg p-3'>
				<p className='flex items-center gap-1.5'>
					<Badge className='rounded-sm grid place-items-center p-0 w-3.5'>
						{table.getFilteredSelectedRowModel().rows.length}
					</Badge>
					<span> selected</span>
				</p>

				<Button
					className='bg-background'
					variant='outline'
					size='sm'
				>
					<Grid2x2Plus className='mr-1.5' />
					<span>Add to collection</span>
				</Button>

				<Button
					className='bg-background'
					variant='outline'
					size='sm'
				>
					<Grid2X2 className='mr-1.5' />
					<span>Create new collection</span>
				</Button>

				<Button
					className='bg-background'
					variant='outline'
					size='sm'
				>
					<MailPlus className='mr-1.5' />
					<span>Send email</span>
				</Button>

				<Button
					variant='ghost'
					size='icon'
				>
					<Ellipsis />
				</Button>
			</div> */}

			{!hidePagination && <DataTablePagination table={table} />}
		</div>
	);
}
