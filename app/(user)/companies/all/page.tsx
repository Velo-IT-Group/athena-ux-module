import React from 'react';
import { Button } from '@/components/ui/button';
import { ListFilter, SlidersHorizontal } from 'lucide-react';
import CompanyList from '@/components/lists/company-list';

type Props = {};

const Page = async (props: Props) => {
	return (
		<>
			<header className='flex items-center justify-between gap-3 h-9 px-3 border-b'>
				<Button
					size='sm'
					variant='ghost'
					className='space-x-1.5 h-6'
				>
					<ListFilter />
					<span className='text-xs'>Filter</span>
				</Button>

				<Button
					size='sm'
					variant='secondary'
					className='space-x-1.5 h-6'
				>
					<SlidersHorizontal />
					<span className='text-xs'>Display</span>
				</Button>
			</header>

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
