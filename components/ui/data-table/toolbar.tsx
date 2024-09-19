'use client';
import React from 'react';

import { X } from 'lucide-react';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { DataTableViewOptions } from './view-options';

import { DataTableFacetedFilter } from './faceted-filter';
import { Identifiable } from '@/types';
import Search from '@/components/search';
import { usePathname } from 'next/navigation';
import { useCookieFilter } from '@/hooks/useCookieFilter';
import { QueryFunction } from '@tanstack/react-query';

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
	const { addCondition, removeCondition } = useCookieFilter(
		table.options?.meta?.filterParams ?? {},
		table.options?.meta?.definition ?? { page: '' }
	);

	const searchCondition = table.options.meta?.filterKey
		? table.options?.meta?.filterParams?.conditions?.find(
				(c) => Object.keys(c.parameter)[0] === table.options.meta?.filterKey
		  )
		: undefined;

	return (
		<div className='flex items-center justify-between'>
			<div className='flex flex-1 items-center space-x-2'>
				{table.options?.meta?.filterKey && (
					<Search
						placeholder='Filter...'
						queryParam={table.options?.meta?.filterKey as string}
						defaultValue={searchCondition?.parameter[table.options?.meta?.filterKey as string] as string}
						className='h-9 w-[150px] lg:w-[250px] overflow-hidden'
						addCondition={addCondition}
						removeCondition={removeCondition}
					/>
				)}

				{facetedFilters?.map(({ accessoryKey, items }) => {
					const column = table.getColumn(accessoryKey as string);
					const defaultValueCondition = table.options?.meta?.filterParams?.conditions?.find(
						// @ts-ignore
						(c) => Object.keys(c.parameter)[0] === column?.columnDef?.meta?.filterKey
					);
					const defaultValues = // @ts-ignore
						(defaultValueCondition?.parameter[column?.columnDef?.meta?.filterKey as string] as string)
							?.trim()
							?.replace('(', '')
							?.replace(')', '')
							?.split(',');
					return (
						<React.Fragment key={column?.id}>
							{column && (
								<DataTableFacetedFilter
									column={column}
									title={accessoryKey.toString()}
									options={items.map(({ name, id }) => {
										return { label: name, value: id };
									})}
									defaultValues={defaultValues}
									addCondition={addCondition}
									removeCondition={removeCondition}
								/>
							)}
						</React.Fragment>
					);
				})}

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
