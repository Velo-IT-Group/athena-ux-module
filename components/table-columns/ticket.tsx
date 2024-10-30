'use client';
import { ColumnDef } from '@tanstack/react-table';
import type { ReferenceType, ServiceTicket } from '@/types/manage';
import { DataTableColumnHeader } from '../ui/data-table/column-header';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';

export const columns: ColumnDef<ServiceTicket>[] = [
	{
		accessorKey: 'id',
		header: ({ column, table }) => (
			<DataTableColumnHeader
				column={column}
				title='Ticket'
				setSort={table.setSort}
			/>
		),
		cell: ({ row }) => (
			<Link
				href={`/tickets/${row.getValue('id')}`}
				// target='_blank'
				className={cn(buttonVariants({ variant: 'link', className: 'w-[80px] px-0' }))}
			>
				#{row.getValue('id')}
			</Link>
		),
		enableSorting: true,
		enableHiding: false,
		meta: {
			filterKey: 'id',
		},
	},
	{
		accessorKey: 'summary',
		header: ({ column, table }) => {
			return (
				<DataTableColumnHeader
					column={column}
					title='Summary'
					setSort={table.setSort}
				/>
			);
		},
		cell: ({ row }) => {
			// const label = labels.find((label) => label.value === row.original.label);

			return (
				<div className='flex items-center space-x-1.5'>
					<Circle
						className={cn(
							'stroke-none',
							row?.original?.priority?.id === 6 && 'fill-[#DC3221]',
							// row?.original?.priority?.id === 8 && 'fill-yellow-500',
							row?.original?.priority?.id === 7 && 'fill-[#029E73]',
							row?.original?.priority?.id === 8 && 'fill-[#56B4E9]'
						)}
					/>
					<span className='max-w-[40ch] truncate font-medium'>{row.getValue('summary')}</span>
				</div>
			);
		},
		meta: {
			filterKey: 'summary',
		},
	},
	{
		accessorKey: 'board',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Board'
			/>
		),
		cell: ({ row }) => {
			const board = row.getValue('board') as ReferenceType;

			return (
				<div className='flex w-[100px] items-center'>
					{/* {status.icon && <status.icon className='mr-2 h-3.5 w-3.5 text-muted-foreground' />} */}
					<span>{board?.name}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			// console.log(value, id, row);
			const referenceRow = row.getValue(id) as ReferenceType;

			return referenceRow && referenceRow.id ? value.includes(String(referenceRow.id)) : false;
		},
		meta: {
			filterKey: 'board/id',
		},
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

			return (
				<div className='flex w-[100px] items-center'>
					<span>{status?.name}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			const referenceRow = row.getValue(id) as ReferenceType;

			return referenceRow && referenceRow.id ? value.includes(String(referenceRow.id)) : false;
		},
		meta: {
			filterKey: 'status/id',
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
			const reference = row.getValue('contact') as ReferenceType;

			// if (!status) {
			// 	return null;
			// }

			return (
				<div className='flex items-center'>
					{/* {status.icon && <status.icon className='mr-2 h-3.5 w-3.5 text-muted-foreground' />} */}
					<span>{reference?.name}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			const referenceRow = row.getValue(id) as ReferenceType;

			return referenceRow && referenceRow.id ? value.includes(String(referenceRow.id)) : false;
		},
		meta: {
			filterKey: 'contact/id',
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

			return (
				<div className='flex items-center'>
					<span>{reference?.name}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			const referenceRow = row.getValue(id) as ReferenceType;

			return referenceRow && referenceRow.id ? value.includes(String(referenceRow.id)) : false;
		},
		meta: {
			filterKey: 'company/id',
		},
	},
	{
		accessorKey: 'slaStatus',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='SLA Status'
			/>
		),
		cell: ({ row }) => {
			const sla = row.getValue('slaStatus') as string;

			// if (!status) {
			// 	return null;
			// }

			return (
				<div className='flex items-center'>
					{/* {status.icon && <status.icon className='mr-2 h-3.5 w-3.5 text-muted-foreground' />} */}
					<span>{sla}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			const referenceRow = row.getValue(id) as ReferenceType;

			return referenceRow && referenceRow.id ? value.includes(String(referenceRow.id)) : false;
		},
		meta: {
			filterKey: 'slaStatus/id',
		},
	},
	{
		accessorKey: 'priority',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Priority'
			/>
		),
		cell: ({ row }) => {
			const priority = row.getValue('priority') as ReferenceType;

			// if (!priority) {
			// 	return null;
			// }

			return (
				<div className='flex items-center'>
					{/* {priority.icon && <priority.icon className='mr-2 h-3.5 w-3.5 text-muted-foreground' />} */}
					<span>{priority?.name}</span>
				</div>
			);
		},
		enableHiding: true,
		filterFn: (row, id, value) => {
			const referenceRow = row.getValue(id) as ReferenceType;

			return referenceRow && referenceRow.id ? value.includes(String(referenceRow.id)) : false;
		},
		meta: {
			filterKey: 'priority/id',
		},
	},
	{
		accessorKey: 'owner',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Owner'
			/>
		),
		cell: ({ row }) => {
			const owner = row.getValue('owner') as ReferenceType;

			// console.log(owner);

			// if (!priority) {
			// 	return null;
			// }

			return (
				<div className='flex items-center'>
					{/* {priority.icon && <priority.icon className='mr-2 h-3.5 w-3.5 text-muted-foreground' />} */}
					<span>{owner?.name}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			console.log(row, id, value);
			const referenceRow = row.getValue(id) as ReferenceType;

			if (!referenceRow) return false;

			return referenceRow && referenceRow.id ? value.includes(String(referenceRow.id)) : false;
		},
		meta: {
			filterKey: 'owner/id',
		},
	},
	// {
	// 	id: 'actions',
	// 	cell: ({ row }) => <DataTableRowActions row={row} />,
	// },
];
