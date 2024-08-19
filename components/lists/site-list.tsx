import { Company, ReferenceType, Site } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import React from 'react';
import { Combobox } from '../ui/combobox';
import { getCompanySites } from '@/lib/manage/read';
import { Button } from '../ui/button';
import { Building } from 'lucide-react';
import { FacetedFilter } from '../ui/data-table/toolbar';

type Props = {
	id: number;
	companyId: number;
	path: string;
	type: 'table' | 'combobox' | 'select';
	defaultValue?: ReferenceType;
	params?: Conditions<Site>;
	facetedFilters?: FacetedFilter<Site>[];
};

const SiteList = async ({
	id,
	companyId,
	path,
	type,
	defaultValue,
	params = {
		pageSize: 1000,
		fields: ['id', 'name'],
	},
	facetedFilters,
}: Props) => {
	const sites = await getCompanySites(companyId, params);

	return (
		<>
			{type === 'combobox' && (
				<Combobox
					id={id}
					path={path}
					type='ticket'
					items={
						sites?.map(({ id, name }) => {
							return { label: name, value: `${id}-${name}` };
						}) ?? []
					}
					value={`${defaultValue?.id}-${defaultValue?.name}`}
					// setValue={() => {}}
					placeholder='Filter sites...'
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
						<span className='text-xs text-muted-foreground'>{defaultValue ? defaultValue.name : 'Add site'}</span>
					</Button>
				</Combobox>
			)}
		</>
	);
};

export default SiteList;
