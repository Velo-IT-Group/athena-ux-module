import { getCompanies } from '@/lib/manage/read';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/table-columns/company';

type Props = {};

const Page = async (props: Props) => {
	const companies = await getCompanies({
		conditions: [{ 'status/id': 1 }],
		childConditions: [{ 'types/id': 1 }],
		orderBy: { key: 'name', order: 'asc' },
		fields: ['id', 'identifier', 'name', 'phoneNumber', 'territory'],
		pageSize: 1000,
	});

	return (
		<main className='p-3 space-y-3'>
			<header>
				<h1 className='text-lg font-semibold'>Companies</h1>
			</header>

			<section>
				<DataTable
					data={companies}
					columns={columns}
				/>
			</section>
		</main>
	);
};

export default Page;
