'use client';
import { ColumnDef } from '@tanstack/react-table';
import type { Configuration, ReferenceType } from '@/types/manage';
import { DataTableColumnHeader } from '../ui/data-table/column-header';
import { DataTableRowActions } from '../ui/data-table/row-actions';
import Link from 'next/link';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';

export const columns: ColumnDef<Configuration>[] = [
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
				href={`https://manage.velomethod.com/v4_6_release/services/system_io/router/openrecord.rails?locale=en_US&recordType=ConfigFV&companyName=velo&recid=${row.original.id}`}
				target='_blank'
				className={cn('font-medium', buttonVariants({ variant: 'link', className: 'px-0' }))}
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
			return <span>{status?.name}</span>;
		},
		enableSorting: false,
		enableHiding: false,
		filterFn: (row, id, value) => {
			const referenceRow = row.getValue(id) as ReferenceType;

			if (!referenceRow) return false;

			return value.includes(String(referenceRow.id));
		},
		meta: {
			filterKey: 'status/id',
		},
	},
	{
		accessorKey: 'company',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Company'
			/>
		),
		cell: ({ row }) => {
			const reference = row.getValue('company') as ReferenceType;
			return <span>{reference?.name}</span>;
		},
		enableSorting: false,
		enableHiding: false,
		filterFn: (row, id, value) => {
			const referenceRow = row.getValue(id) as ReferenceType;

			if (!referenceRow) return false;

			return value.includes(String(referenceRow.id));
		},
		meta: {
			filterKey: 'company/id',
		},
	},
	{
		accessorKey: 'type',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Type'
			/>
		),
		cell: ({ row }) => {
			const reference = row.getValue('type') as ReferenceType;
			return <span>{reference?.name}</span>;
		},
		enableSorting: false,
		enableHiding: false,
		filterFn: (row, id, value) => {
			const referenceRow = row.getValue(id) as ReferenceType;

			if (!referenceRow) return false;

			return value.includes(String(referenceRow.id));
		},
		meta: {
			filterKey: 'type/id',
		},
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
			return <span>{site?.name}</span>;
		},
		enableSorting: false,
		enableHiding: false,
		filterFn: (row, id, value) => {
			const referenceRow = row.getValue(id) as ReferenceType;

			if (!referenceRow) return false;

			return value.includes(String(referenceRow.id));
		},
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
				<>
					{contact !== undefined && (
						<div className='flex items-center space-x-2'>
							<User className='mr-1.5' />
							<span className='truncate font-medium'>{contact?.name}</span>
						</div>
					)}
				</>
			);
		},
		filterFn: (row, id, value) => {
			const referenceRow = row.getValue(id) as ReferenceType;

			if (!referenceRow) return false;

			return value.includes(String(referenceRow.id));
		},
		meta: {
			filterKey: 'contact/id',
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
];
