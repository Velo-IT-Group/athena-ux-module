import React from 'react';
import CompanyList from '@/components/lists/company-list';
import FilterHeader from '@/components/filter-header';

type Props = {};

const Page = async (props: Props) => {
	return (
		<>
			<FilterHeader filters={[]} />

			<section className='p-3'>
				<CompanyList
					type='table'
					id={0}
					path=''
					params={{
						// conditions: { 'status/id': 1 },
						// childConditions: { 'types/id': 1 },
						orderBy: { key: 'name' },
					}}
				/>
			</section>
		</>
	);
};

export default Page;
