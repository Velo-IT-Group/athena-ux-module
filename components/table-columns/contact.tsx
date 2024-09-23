'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { CommunicationItem, Contact, ReferenceType } from '@/types/manage';
import { DataTableColumnHeader } from '../ui/data-table/column-header';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import parsePhoneNumber from 'libphonenumber-js';
import CheckMark from '@/app/(user)/checkmark';

export const columns: ColumnDef<Contact>[] = [
	{
		accessorKey: 'firstName',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='First Name'
			/>
		),
		cell: ({ row }) => (
			<Link
				href={`/contacts/${row.original.id}`}
				className='font-medium w-[80px]'
			>
				{row.getValue('firstName')}
			</Link>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'lastName',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Last Name'
			/>
		),
		cell: ({ row }) => {
			// const label = labels.find((label) => label.value === row.original.label);

			return (
				<Link
					href={`/contacts/${row.original.id}`}
					className='font-medium w-[80px]'
				>
					{row.getValue('lastName')}
				</Link>
			);
		},
	},
	{
		accessorKey: 'defaultPhoneNbr',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Phone Number'
			/>
		),
		cell: ({ row }) => {
			const number = parsePhoneNumber(row?.getValue('defaultPhoneNbr') ?? '', 'US');

			return (
				<span className={cn(buttonVariants({ variant: 'link' }), 'px-0')}>{number?.format('NATIONAL') ?? ''}</span>
			);
		},
	},
	{
		accessorKey: 'communicationItems',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Email'
			/>
		),
		cell: ({ row }) => {
			const communicationItems = row.getValue('communicationItems') as CommunicationItem[];
			const defaultEmail = communicationItems?.find((item) => item.defaultFlag && item.type.name === 'Email');

			return <span className={cn(buttonVariants({ variant: 'link' }), 'px-0')}>{defaultEmail?.value}</span>;
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
			const company = row.getValue('company') as ReferenceType;

			return <span>{company?.name}</span>;
		},
		filterFn: (row, id, value) => {
			const referenceRow = row.getValue(id) as ReferenceType;

			return referenceRow ? value.includes(String(referenceRow.id)) : false;
		},
		meta: {
			filterKey: 'company/id',
		},
	},
];

export const contactColumns: ColumnDef<Contact>[] = [
	{
		id: 'select',
		header: '',
		cell: ({ row }) => <CheckMark row={row} />,
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'firstName',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='First Name'
			/>
		),
		cell: ({ row }) => (
			<Link
				href={`/contacts/${row.original.id}`}
				className='font-medium w-[80px]'
			>
				{row.getValue('firstName')}
			</Link>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'lastName',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Last Name'
			/>
		),
		cell: ({ row }) => {
			// const label = labels.find((label) => label.value === row.original.label);

			return (
				<Link
					href={`/contacts/${row.original.id}`}
					className='font-medium w-[80px]'
				>
					{row.getValue('lastName')}
				</Link>
			);
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
			const company = row.getValue('company') as ReferenceType;

			return <span>{company?.name}</span>;
		},
		filterFn: (row, id, value) => {
			const referenceRow = row.getValue(id) as ReferenceType;

			return referenceRow ? value.includes(String(referenceRow.id)) : false;
		},
		meta: {
			filterKey: 'company/id',
		},
	},
	{
		accessorKey: 'defaultPhoneNbr',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Phone Number'
			/>
		),
		cell: ({ row }) => {
			const number = parsePhoneNumber(row?.getValue('defaultPhoneNbr') ?? '', 'US');

			return <span>{number?.format('NATIONAL') ?? ''}</span>;
		},
	},
	{
		accessorKey: 'communicationItems',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Email'
			/>
		),
		cell: ({ row }) => {
			const communicationItems = row.getValue('communicationItems') as CommunicationItem[];
			const defaultEmail = communicationItems?.find((item) => item.defaultFlag && item.type.name === 'Email');

			return <span>{defaultEmail?.value}</span>;
		},
	},
];
