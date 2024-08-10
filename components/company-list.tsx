import { Company, ReferenceType } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import React from 'react';
import { Combobox } from './ui/combobox';
import { getCompanies } from '@/lib/manage/read';
import { Button } from './ui/button';
import { Building } from 'lucide-react';

type Props = {
	type: 'table' | 'combobox' | 'select';
	defaultValue?: ReferenceType;
	params?: Conditions<Company>;
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
}: Props) => {
	const companies = await getCompanies(params);

	return (
		<>
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
