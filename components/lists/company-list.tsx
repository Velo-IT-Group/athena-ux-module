import { Company, ReferenceType } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import React from 'react';
import { Combobox } from '../ui/combobox';
import { getCompanies } from '@/lib/manage/read';
import { Button } from '../ui/button';
import { Building } from 'lucide-react';
import { DataTable } from '../ui/data-table';
import { columns } from '../table-columns/company';
import { FacetedFilter } from '../ui/data-table/toolbar';

type Props = {
	type: 'table' | 'combobox' | 'select';
	defaultValue?: ReferenceType;
	params?: Conditions<Company>;
	facetedFilters?: FacetedFilter<Company>[];
};

const CompanyList = async ({
	type,
	defaultValue,
	params = {
		conditions: [{ parameter: { 'status/id': 1 } }],
		childConditions: [{ parameter: { 'types/id': 1 } }],
		orderBy: { key: 'name' },
		pageSize: 1000,
	},
	facetedFilters,
}: Props) => {
	const { companies, count } = await getCompanies(params);

	return (
		<>
			{type === 'table' && (
				<DataTable
					data={companies}
					columns={columns}
					meta={{ filterKey: 'name' }}
					facetedFilters={facetedFilters}
					count={count}
				/>
			)}
			{type === 'combobox' && (
				<Combobox
					items={
						companies?.map(({ id, name }) => {
							return { label: name, value: `${id}-${name}` };
						}) ?? []
					}
					value={`${defaultValue?.id}-${defaultValue?.name}`}
					// setValue={async (e) => {}}
					placeholder='Filter companies...'
					side='left'
					align='start'
				>
					<Button
						size='sm'
						variant='ghost'
						role='combobox'
						className='flex'
					>
						<Building className='mr-1.5' />
						<span className='text-xs text-muted-foreground'>{defaultValue ? defaultValue.name : 'Add company'}</span>
					</Button>
				</Combobox>
			)}
		</>
	);
};

export default CompanyList;
