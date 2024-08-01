'use client';

import { PlusCircle, X } from 'lucide-react';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './view-options';

import { DataTableFacetedFilter } from './faceted-filter';
import { Suspense, useEffect, useState } from 'react';
import { getPriorities, getStatuses } from '@/lib/manage/read';
import { BoardStatus, Priority } from '@/types/manage';
import { Skeleton } from '../skeleton';
import AsyncSelector from '@/components/async-selector';

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;
	const [statuses, setStatuses] = useState<BoardStatus[]>([]);
	const [priorities, setPriorities] = useState<Priority[]>([]);

	useEffect(() => {
		getStatuses(30, { orderBy: { key: 'name' } }).then(setStatuses);
		getPriorities({ orderBy: { key: 'sortOrder' } }).then(setPriorities);
	}, []);

	return (
		<div className='flex items-center justify-between'>
			<div className='flex flex-1 items-center space-x-2'>
				<Input
					placeholder='Filter tickets...'
					value={(table.getColumn('summary')?.getFilterValue() as string) ?? ''}
					onChange={(event) => table.getColumn('summary')?.setFilterValue(event.target.value)}
					className='h-8 w-[150px] lg:w-[250px]'
				/>
				{table.getColumn('status') && (
					<Suspense fallback={<Skeleton className='h-9 w-48' />}>
						<AsyncSelector
							Icon={PlusCircle}
							fetchFunction={getStatuses(30, { orderBy: { key: 'name' } })}
						>
							{(data) => (
								<ul>
									{data.map((user) => (
										<li key={user.id}>{user.name}</li>
									))}
								</ul>
							)}
						</AsyncSelector>
						{/* <DataTableFacetedFilter
							column={table.getColumn('status')}
							title='Status'
							options={statuses.map(({ name, id }) => {
								return { label: name, value: String(id) };
							})}
						/> */}
					</Suspense>
				)}
				{table.getColumn('priority') && (
					<DataTableFacetedFilter
						column={table.getColumn('priority')}
						title='Priority'
						options={priorities.map(({ name, id }) => {
							return { label: name, value: String(id) };
						})}
					/>
				)}
				{isFiltered && (
					<Button
						variant='ghost'
						onClick={() => table.resetColumnFilters()}
						className='h-8 px-2 lg:px-3'
					>
						Reset
						<X className='ml-2 h-4 w-4' />
					</Button>
				)}
			</div>
			<DataTableViewOptions table={table} />
		</div>
	);
}
