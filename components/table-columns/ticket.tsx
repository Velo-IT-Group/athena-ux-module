'use client';
import { ColumnDef } from '@tanstack/react-table';
import type { ReferenceType, ServiceTicket } from '@/types/manage';
import { DataTableColumnHeader } from '../ui/data-table/column-header';
import { DataTableRowActions } from '../ui/data-table/row-actions';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';

export const columns: ColumnDef<ServiceTicket>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Ticket'
			/>
		),
		cell: ({ row }) => (
			<Link
				href={`/tickets/${row.getValue('id')}`}
				className={cn(buttonVariants({ variant: 'link' }), 'w-[80px]')}
			>
				#{row.getValue('id')}
			</Link>
		),
		enableSorting: true,
		enableHiding: false,
	},
	{
		accessorKey: 'summary',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Summary'
			/>
		),
		cell: ({ row }) => {
			// const label = labels.find((label) => label.value === row.original.label);

			return (
				<div className='flex items-center space-x-2'>
					{/* {label && <Badge variant='outline'>{label.label}</Badge>} */}
					<Circle className={cn('stroke-none fill-primary', row?.original?.priority?.id === 7 && 'fill-green-500')} />
					<span className='max-w-[500px] truncate font-medium'>{row.getValue('summary')}</span>
				</div>
			);
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
					<span>{board.name}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			// console.log(value, id, row);
			const referenceRow = row.getValue(id) as ReferenceType;

			return referenceRow && referenceRow.id ? value.includes(String(referenceRow.id)) : false;
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
					{/* {status.icon && <status.icon className='mr-2 h-3.5 w-3.5 text-muted-foreground' />} */}
					<span>{status.name}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			const referenceRow = row.getValue(id) as ReferenceType;

			return referenceRow && referenceRow.id ? value.includes(String(referenceRow.id)) : false;
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
					<span>{priority.name}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			const referenceRow = row.getValue(id) as ReferenceType;

			return referenceRow && referenceRow.id ? value.includes(String(referenceRow.id)) : false;
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
	},
	{
		id: 'actions',
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
];
