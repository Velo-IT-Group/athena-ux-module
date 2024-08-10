import TableSkeleton from '@/components/ui/data-table/skeleton';
import React from 'react';

const Loading = () => {
	return (
		<main className='p-3 grow space-y-3'>
			<header className='flex items-center gap-3'>
				<h1 className='text-lg font-semibold'>Tickets</h1>
			</header>

			<section>
				<TableSkeleton />
			</section>
		</main>
	);
};

export default Loading;
