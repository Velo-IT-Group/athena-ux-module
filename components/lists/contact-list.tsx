import { Contact, ReferenceType } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import React, { ReactNode } from 'react';
import { Combobox } from '../ui/combobox';
import { getAllContacts } from '@/lib/manage/read';
import { Button } from '../ui/button';
import { User } from 'lucide-react';
import { DataTable } from '../ui/data-table';
import { columns, contactColumns } from '../table-columns/contact';
import { FacetedFilter } from '../ui/data-table/toolbar';

type Props = {
	id: number;
	serviceType: 'ticket';
	path: string;
	type: 'table' | 'combobox' | 'select';
	defaultValue?: ReferenceType;
	params?: Conditions<Contact>;
	facetedFilters?: FacetedFilter<Contact>[];
	hidePagination?: boolean;
	children?: ReactNode;
	columnDefs?: 'regular' | 'homepage';
};

const ContactList = async ({
	id,
	path,
	serviceType,
	type,
	defaultValue,
	params,
	children,
	hidePagination,
	facetedFilters,
	columnDefs = 'regular',
}: Props) => {
	const { contacts, count } = await getAllContacts(params);

	return (
		<>
			{type === 'table' && (
				<DataTable
					data={contacts}
					columns={columnDefs === 'homepage' ? contactColumns : columns}
					facetedFilters={facetedFilters}
					count={count}
					meta={{ filterKey: 'firstName' }}
					hidePagination={hidePagination}
				/>
			)}
			{type === 'combobox' && (
				<Combobox
					id={id}
					path={path}
					type={serviceType}
					items={
						contacts?.map(({ id, firstName, lastName }) => {
							return { label: `${firstName} ${lastName ?? ''}`, value: `${id}-${firstName} ${lastName}` };
						}) ?? []
					}
					value={`${defaultValue?.id}-${defaultValue?.name}`}
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
