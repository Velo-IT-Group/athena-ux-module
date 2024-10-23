'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { Company, ReferenceType } from '@/types/manage';
import { DataTableColumnHeader } from '../ui/data-table/column-header';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import parsePhoneNumber from 'libphonenumber-js';

export const columns: ColumnDef<Company>[] = [
	{
		accessorKey: 'identifier',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Company'
			/>
		),
		cell: ({ row }) => (
			<Link
				href={`/companies/${row.original.id}`}
				className={cn(buttonVariants({ variant: 'link' }), 'w-[80px] px-0 justify-start')}
			>
				{row.getValue('identifier')}
			</Link>
		),
		size: 15,
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
		cell: ({ row }) => {
			// const label = labels.find((label) => label.value === row.original.label);

			return (
				<div className='flex items-center space-x-1.5'>
					{/* {label && <Badge variant='outline'>{label.label}</Badge>} */}
					{/* <Circle className={cn('stroke-none fill-primary', row?.original?.priority?.id === 7 && 'fill-green-500')} /> */}
					<span className='max-w-[500px] truncate font-medium'>{row.getValue('name')}</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'phoneNumber',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Phone Number'
			/>
		),
		cell: ({ row }) => {
			const number = parsePhoneNumber(row.getValue('phoneNumber'), 'US');

			return <span className={cn(buttonVariants({ variant: 'link' }), 'px-0')}>{number?.format('NATIONAL')}</span>;
		},
	},
	{
		accessorKey: 'territory',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Territory'
			/>
		),
		cell: ({ row }) => {
			const territory = row.getValue('territory') as ReferenceType;

			return <span>{territory.name}</span>;
		},
	},
	// {
	// 	id: 'actions',
	// 	cell: ({ row }) => <DataTableRowActions row={row} />,
	// },
];
