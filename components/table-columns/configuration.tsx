'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import type { Configuration, ReferenceType } from '@/types/manage';
import { DataTableColumnHeader } from '../ui/data-table/column-header';
import { DataTableRowActions } from '../ui/data-table/row-actions';
import Link from 'next/link';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';

export const columns: ColumnDef<Configuration>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Select all'
				className='translate-y-[2px]'
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label='Select row'
				className='translate-y-[2px]'
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Name'
			/>
		),
		cell: ({ row }) => (
			<Link
				href={`/configurations/${row.original.id}`}
				className={cn('font-medium max-w-[500px]', buttonVariants({ variant: 'link' }))}
			>
				{row.getValue('name')}
			</Link>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'status',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Status'
			/>
		),
		cell: ({ row }) => {
			const status = row.getValue('status') as ReferenceType;
			return <span>{status.name}</span>;
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'site',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Site'
			/>
		),
		cell: ({ row }) => {
			const site = row.getValue('site') as ReferenceType;
			return <span>{site.name}</span>;
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'contact',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Contact'
			/>
		),
		cell: ({ row }) => {
			const contact = row.getValue('contact') as ReferenceType;
			return (
				<div className='flex items-center space-x-2'>
					<User className='mr-1.5' />
					<span className='truncate font-medium'>{contact.name}</span>
				</div>
			);
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
];
