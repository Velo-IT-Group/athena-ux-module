import TicketList from '@/components/lists/ticket-list';
import TableSkeleton from '@/components/ui/data-table/skeleton';
import { Suspense } from 'react';

type Props = {
	searchParams: {
		[key: string]: string | number;
	};
};

const Page = async ({ searchParams }: Props) => {
	const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : undefined;
	const pageSize = typeof searchParams.page === 'string' ? Number(searchParams.pageSize) : undefined;
	const search = typeof searchParams.search === 'string' ? String(searchParams.pageSize) : undefined;

	return (
		<main className='p-3 grow space-y-3'>
			<header className='flex items-center gap-3'>
				<h1 className='text-lg font-semibold'>Tickets</h1>
			</header>

			<section>
				<Suspense fallback={<TableSkeleton />}>
					<TicketList
						type='table'
						params={{
							conditions: [
								{ parameter: { 'board/id': 30 } },
								{ parameter: { closedFlag: false } },
								// { parameter: { parentTicketId: null }, comparator: '==' },
							],
							pageSize: pageSize || 10,
							page: page || 1,
						}}
					/>
				</Suspense>
			</section>
		</main>
	);
};

export default Page;
