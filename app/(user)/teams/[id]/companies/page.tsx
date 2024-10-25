import React from 'react';
import CompanyList from '@/components/lists/company-list';
import getQueryClient from '@/app/getQueryClient';
import { getCompanies } from '@/lib/manage/read';
import FilterHeader from '@/components/filter-header';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
type QueryParams = Promise<{ id: string }>;

type Props = {
	params: QueryParams;
};

const Page = async ({ params }: Props) => {
	const { id } = await params;
	const client = getQueryClient();

	// const companies = await client.fetchQuery<Company[]>({
	// 	queryKey: [
	// 		'/company/companies',
	// 		 as Conditions<Company>,
	// 	],
	// });
	return (
		<>
			<FilterHeader filters={[]} />

			<section className='p-3'>
				<CompanyList
					type='table'
					id={0}
					path=''
					params={{
						conditions: { 'territory/id': parseInt(id), 'status/id': 1 },
						childConditions: { 'types/id': 1 },
						orderBy: { key: 'name' },
					}}
				/>
			</section>
		</>
	);
};

export default Page;
