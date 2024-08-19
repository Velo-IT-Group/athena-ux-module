'use client';
import { getCompanies } from '@/lib/manage/read';
import { Company } from '@/types/manage';
import React, { useEffect, useState } from 'react';
import { CommandItem } from '../ui/command';
import { Building } from 'lucide-react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

type Props = {
	router: AppRouterInstance;
};

const CommandCompaniesList = ({ router }: Props) => {
	const [companies, setCompanies] = useState<Company[]>([]);

	useEffect(() => {
		getCompanies({
			conditions: [{ parameter: { 'status/id': 1 } }],
			childConditions: [{ parameter: { 'types/id': 1 } }],
			orderBy: { key: 'name', order: 'asc' },
			fields: ['id', 'name'],
			pageSize: 1000,
		}).then(({ companies }) => setCompanies(companies));
	}, []);

	return (
		<>
			{companies.map((company) => (
				<CommandItem
					key={company.id}
					value={`${company.identifier}-${company.name}`}
					onSelect={() => {
						router.push(`/companies/${company.id}`);
					}}
				>
					<Building className='mr-1.5' />
					{company.name}
				</CommandItem>
			))}
		</>
	);
};

export default CommandCompaniesList;
