import { columns } from '@/components/table-columns/ticket';
import { DataTable } from '@/components/ui/data-table';
import { getBoards, getTickets } from '@/lib/manage/read';

type Props = {};

const Page = async (props: Props) => {
	const tickets = await getTickets({
		conditions: [{ parameter: { 'board/id': 30 } }, { parameter: { closedFlag: false } }],
		pageSize: 1000,
	});

	const boards = await getBoards({ orderBy: { key: 'name' }, pageSize: 1000 });

	return (
		<main className='p-3 grow space-y-3'>
			<header className='flex items-center gap-3'>
				<h1 className='text-lg font-semibold'>Tickets</h1>
			</header>

			<section>
				<DataTable
					data={tickets}
					columns={columns}
					facetedFilters={[{ accessoryKey: 'board', items: boards }]}
					meta={{ filterKey: 'summary' }}
				/>
			</section>
		</main>
	);
};

export default Page;
