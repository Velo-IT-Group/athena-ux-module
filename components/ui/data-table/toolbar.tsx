'use client';
import React from 'react';

import { X } from 'lucide-react';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './view-options';

import { DataTableFacetedFilter } from './faceted-filter';
import { Identifiable } from '@/types';

export interface FacetedFilter<TData> {
	accessoryKey: keyof TData;
	items: Identifiable[];
}
interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	facetedFilters?: FacetedFilter<TData>[];
}

export function DataTableToolbar<TData>({ table, facetedFilters }: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;

	return (
		<div className='flex items-center justify-between'>
			<div className='flex flex-1 items-center space-x-2'>
				{table.options?.meta?.filterKey && (
					<Input
						placeholder='Filter...'
						value={(table.getColumn(table.options?.meta?.filterKey as string)?.getFilterValue() as string) ?? ''}
						onChange={(event) =>
							table.getColumn(table.options?.meta?.filterKey as string)?.setFilterValue(event.target.value)
						}
						className='h-9 w-[150px] lg:w-[250px]'
					/>
				)}

				{facetedFilters?.map(({ accessoryKey, items }) => (
					<React.Fragment key={table.getColumn(accessoryKey as string)?.id}>
						{table.getColumn(accessoryKey as string) && (
							<DataTableFacetedFilter
								column={table.getColumn(accessoryKey as string)}
								title={accessoryKey.toString()}
								options={items.map(({ name, id }) => {
									return { label: name, value: id };
								})}
							/>
						)}
					</React.Fragment>
				))}

				{isFiltered && (
					<Button
						variant='ghost'
						onClick={() => table.resetColumnFilters()}
						className='h-9 px-2 lg:px-3'
					>
						Reset
						<X className='ml-2 h-3.5 w-3.5' />
					</Button>
				)}
			</div>
			<DataTableViewOptions table={table} />
		</div>
	);
}
