import { columns } from '@/components/table-columns/ticket';
import { DataTable } from '@/components/ui/data-table';
import { getTickets } from '@/lib/manage/read';

type Props = {};

const Page = async (props: Props) => {
	const tickets = await getTickets({ conditions: [{ 'board/id': 30 }, { closedFlag: false }], pageSize: 1000 });

	return (
		<main className='p-3 grow space-y-3'>
			<header className='flex items-center gap-3'>
				<h1 className='text-lg font-semibold'>Tickets</h1>
			</header>

			<section>
				<DataTable
					data={tickets}
					columns={columns}
				/>
			</section>
		</main>
	);
};

export default Page;
