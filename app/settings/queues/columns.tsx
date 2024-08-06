'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/data-table/column-header';
import { DataTableRowActions } from '@/components/ui/data-table/row-actions';
import { Queue } from '@/types/twilio';
import { TaskQueueInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/taskQueue';

export const columns: ColumnDef<TaskQueueInstance>[] = [
	// {
	// 	id: 'select',
	// 	header: ({ table }) => (
	// 		<Checkbox
	// 			checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
	// 			onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
	// 			aria-label='Select all'
	// 			className='translate-y-[2px]'
	// 		/>
	// 	),
	// 	cell: ({ row }) => (
	// 		<Checkbox
	// 			checked={row.getIsSelected()}
	// 			onCheckedChange={(value) => row.toggleSelected(!!value)}
	// 			aria-label='Select row'
	// 			className='translate-y-[2px]'
	// 		/>
	// 	),
	// 	enableSorting: false,
	// 	enableHiding: false,
	// },
	{
		accessorKey: 'friendlyName',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='name'
			/>
		),
		cell: ({ row }) => <span>{row.getValue('friendlyName')}</span>,
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'maxReservedWorkers',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Maximum Reserved Workers'
			/>
		),
		cell: ({ row }) => <span>{row.getValue('maxReservedWorkers')}</span>,
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'targetWorkers',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Target Worker Expression'
			/>
		),
		cell: ({ row }) => <span>{row.getValue('targetWorkers')}</span>,
		enableSorting: false,
		enableHiding: false,
	},
	{
		id: 'actions',
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
];
