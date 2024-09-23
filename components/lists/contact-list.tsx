import React, { ReactNode } from 'react';
import { Contact } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import { getContacts } from '@/lib/manage/read';
import { DataTable } from '../ui/data-table';
import { columns, contactColumns } from '../table-columns/contact';
import { FacetedFilter } from '../ui/data-table/toolbar';
import { TableDefinition } from '@/types';

type Props = {
	type: 'table' | 'combobox' | 'select';
	defaultValue?: number;
	params?: Conditions<Contact>;
	hidePagination?: boolean;
	facetedFilters?: FacetedFilter<Contact>[];
	definition: TableDefinition;
	columnDefs?: 'regular' | 'homepage';
	children?: ReactNode;
};

const ContactList = async ({ type, params, definition, facetedFilters, columnDefs }: Props) => {
	return (
		<>
			{type === 'table' && (
				<DataTable
					columns={columnDefs === 'homepage' ? contactColumns : columns}
					queryFn={getContacts}
					meta={{
						filterKey: 'firstName',
						definition,
						filterParams: params!,
					}}
					facetedFilters={facetedFilters}
				/>
			)}
			{type === 'combobox' && (
				// <Combobox
				// 	id={id}
				// 	path={path}
				// 	type={serviceType}
				// 	items={
				// 		contacts?.map(({ id, firstName, lastName }) => {
				// 			return { label: `${firstName} ${lastName ?? ''}`, value: `${id}-${firstName} ${lastName}` };
				// 		}) ?? []
				// 	}
				// 	value={`${defaultValue?.id}-${defaultValue?.name}`}
				// 	placeholder='Filter contacts...'
				// 	side='left'
				// 	align='start'
				// >
				// 	{children ? (
				// 		children
				// 	) : (
				// 		<Button
				// 			size='sm'
				// 			variant='ghost'
				// 			role='combobox'
				// 			className='flex'
				// 		>
				// 			<User className='mr-1.5' />
				// 			<span className='text-xs text-muted-foreground'>{defaultValue ? defaultValue.name : 'Add contact'}</span>
				// 		</Button>
				// 	)}
				// </Combobox>
				<></>
			)}
		</>
	);
};

export default ContactList;
