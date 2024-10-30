import React, { ReactNode } from 'react';
import { Contact } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import { getContacts } from '@/lib/manage/read';
import { DataTable } from '../ui/data-table';
import { columns, contactColumns } from '../table-columns/contact';
import { FacetedFilter } from '../ui/data-table/toolbar';
import { TableDefinition } from '@/types';
import { Combobox } from '../ui/combobox';
import getQueryClient from '@/app/getQueryClient';
import { User } from 'lucide-react';
import { Button } from '../ui/button';
import { Kbd } from '../linear-combobox/kbd';

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
	const client = getQueryClient();
	const query = await client.fetchQuery<Contact[]>({
		queryKey: [
			'/company/contacts',
			{
				conditions: {
					// 'company/id': companyId ? [companyId] : undefined,
					inactiveFlag: false,
				},
				orderBy: {
					key: 'firstName',
				},
				fields: ['id', 'firstName', 'lastName'],
				pageSize: 1000,
			},
		],
	});
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
				<Combobox
					hotkey='u'
					id={1}
					path=''
					type='ticket'
					items={
						query.map(({ id, firstName, lastName }) => {
							return { label: `${firstName} ${lastName ?? ''}`, value: `${id}-${firstName} ${lastName}` };
						}) ?? []
					}
					placeholder='Filter contacts...'
					side='left'
					align='start'
				>
					<div className='flex items-center justify-between'>
						<Button
							size='sm'
							variant='ghost'
							role='combobox'
							className='flex'
						>
							<User className='mr-1.5' />
							<span className='text-xs text-muted-foreground'>{'Add contact'}</span>
						</Button>

						<Kbd letter='u' />
					</div>
				</Combobox>
			)}
		</>
	);
};

export default ContactList;
