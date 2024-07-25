'use client';
import { getCompanies } from '@/lib/manage/read';
import { Company } from '@/lib/manage/types';
import React, { useEffect, useState } from 'react';
import { CommandItem } from '../ui/command';
import { Building } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {};

const CommandCompaniesList = (props: Props) => {
	const [companies, setCompanies] = useState<Company[]>([]);
	const router = useRouter();

	useEffect(() => {
		getCompanies().then(setCompanies);
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
