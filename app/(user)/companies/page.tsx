import CompanyList from '@/components/lists/company-list';
import TableSkeleton from '@/components/ui/data-table/skeleton';
import { Suspense } from 'react';

type Props = {};

const Page = async (props: Props) => {
	return (
		<main className='p-3 space-y-3'>
			<header>
				<h1 className='text-lg font-semibold'>Companies</h1>
			</header>

			<section>
				<Suspense fallback={<TableSkeleton />}>
					<CompanyList type='table' />
				</Suspense>
			</section>
		</main>
	);
};

export default Page;
