import { getContacts } from '@/lib/manage/read';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/table-columns/contact';

type Props = {};

const Page = async (props: Props) => {
	const contacts = await getContacts({
		pageSize: 1000,
		orderBy: { key: 'firstName' },
		conditions: [{ inactiveFlag: false }],
		fields: ['id', 'firstName', 'lastName', 'company', 'communicationItems', 'defaultPhoneNbr'],
	});

	return (
		<main className='p-3'>
			<header>
				<h1>Contacts</h1>
			</header>

			<section>
				<DataTable
					data={contacts}
					columns={columns}
				/>
			</section>
		</main>
	);
};

export default Page;
