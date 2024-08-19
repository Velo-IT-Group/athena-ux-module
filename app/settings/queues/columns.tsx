'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/data-table/column-header';
import { DataTableRowActions } from '@/components/ui/data-table/row-actions';
import { TaskQueueInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/taskQueue';

export const columns: ColumnDef<TaskQueueInstance>[] = [
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
