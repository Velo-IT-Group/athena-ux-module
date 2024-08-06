'use client';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { getCompanies, getContacts } from '@/lib/manage/read';
import { ReferenceType } from '@/types/manage';
import { Building } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Props = {
	company?: ReferenceType;
};

const CompanySelector = ({ company }: Props) => {
	const [companies, setCompanies] = useState<ReferenceType[]>([]);
	const [selectedCompany, setSelectedCompany] = useState<ReferenceType>();

	useEffect(() => {
		getCompanies({
			conditions: [{ parameter: { 'status/id': 1 } }],
			childConditions: [{ parameter: { 'types/id': 1 } }],
			orderBy: { key: 'name' },
			pageSize: 1000,
		}).then((data) => {
			setCompanies(data);
			setSelectedCompany(data.find((d: ReferenceType) => d.id === company?.id));
		});
	}, []);

	return (
		<Combobox
			items={companies.map((company) => {
				return { label: company?.name, value: `${company?.id}-${company?.name}` };
			})}
			side='left'
			align='start'
			placeholder='Select a company...'
			value={`${company?.id}-${company?.name}`}
			setValue={(e) => {
				const id = e.toString().split('-')[0];
				setSelectedCompany(companies.find((c) => c.id === Number(id)));
			}}
		>
			<Button
				size='sm'
				variant='ghost'
				className='flex'
			>
				<Building className='mr-1.5' />{' '}
				<span className='text-xs text-muted-foreground'>{selectedCompany ? selectedCompany.name : 'Add company'}</span>
			</Button>
		</Combobox>
	);
};

export default CompanySelector;
