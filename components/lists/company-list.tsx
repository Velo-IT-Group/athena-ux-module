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
import getQueryClient from '@/app/getQueryClient';
import { Kbd } from '../linear-combobox/kbd';

type Props = {
	id: number;
	path: string;
	type: 'table' | 'combobox' | 'select';
	defaultValue?: ReferenceType;
	params?: Conditions<Company>;
	facetedFilters?: FacetedFilter<Company>[];
};

const CompanyList = async ({ id, path, type, defaultValue, params, facetedFilters }: Props) => {
	const queryClient = getQueryClient();
	const companies = await queryClient.fetchQuery<Company[], Error, Company[]>({
		queryKey: [
			'/company/companies',
			{
				conditions: {
					'status/id': 1,
				},
				childConditions: { 'types/id': 1 },
				orderBy: { key: 'name' },
				fields: ['id', 'name'],
			} as Conditions<Company>,
		],
	});
	console.log(companies);
	// const { data, count } = data;
	const hotKey = 'o';

	return (
		<>
			{type === 'table' && (
				<DataTable
					columns={columns}
					queryFn={getCompanies}
					facetedFilters={facetedFilters}
					meta={{
						filterKey: 'name',
						definition: { page: '' },
						filterParams: params!,
					}}
					defaultVisibleColumns={{ priority: false, owner: false, slaStatus: false }}
				/>
			)}
			{type === 'combobox' && (
				<Combobox
					id={id}
					path={path}
					type='ticket'
					items={
						companies?.map(({ id, name }) => {
							return { label: name, value: `${id}-${name}` };
						}) ?? []
					}
					value={`${defaultValue?.id}-${defaultValue?.name}`}
					// setValue={() => {}}
					placeholder='Filter companies...'
					side='left'
					align='start'
					hotkey={hotKey}
				>
					<div className='flex items-center justify-between'>
						<Button
							size='sm'
							variant='ghost'
							role='combobox'
							className='flex'
						>
							<Building className='mr-1.5' />
							<span className='text-xs text-muted-foreground'>{defaultValue ? defaultValue.name : 'Add company'}</span>
						</Button>

						<Kbd letter={hotKey} />
					</div>
				</Combobox>
			)}
		</>
	);
};

export default CompanyList;
