import { Contact, ReferenceType } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import React, { ReactNode } from 'react';
import { Combobox } from '../ui/combobox';
import { getAllContacts } from '@/lib/manage/read';
import { Button } from '../ui/button';
import { User } from 'lucide-react';
import { DataTable } from '../ui/data-table';
import { columns } from '../table-columns/contact';
import { FacetedFilter } from '../ui/data-table/toolbar';

type Props = {
	type: 'table' | 'combobox' | 'select';
	defaultValue?: ReferenceType;
	params?: Conditions<Contact>;
	facetedFilters?: FacetedFilter<Contact>[];
	hidePagination?: boolean;
	children?: ReactNode;
};

const ContactList = async ({
	type,
	defaultValue,
	params = {
		childConditions: [{ parameter: { 'types/id': 17 } }],
		pageSize: 1000,
		orderBy: { key: 'firstName' },
	},
	children,
	hidePagination,
	facetedFilters,
}: Props) => {
	const { contacts, count } = await getAllContacts(params);

	return (
		<>
			{type === 'table' && (
				<DataTable
					data={contacts}
					columns={columns}
					facetedFilters={facetedFilters}
					count={count}
					meta={{ filterKey: 'firstName' }}
					hidePagination={hidePagination}
				/>
			)}
			{type === 'combobox' && (
				<Combobox
					items={
						contacts?.map(({ id, firstName, lastName }) => {
							return { label: `${firstName} ${lastName}`, value: `${id}-${firstName} ${lastName}` };
						}) ?? []
					}
					value={`${defaultValue?.id}-${defaultValue?.name}`}
					setValue={() => {}}
					placeholder='Filter contacts...'
					side='left'
					align='start'
				>
					{children ? (
						children
					) : (
						<Button
							size='sm'
							variant='ghost'
							role='combobox'
							className='flex'
						>
							<User className='mr-1.5' />
							<span className='text-xs text-muted-foreground'>{defaultValue ? defaultValue.name : 'Add contact'}</span>
						</Button>
					)}
				</Combobox>
			)}
		</>
	);
};

export default ContactList;
