import { getCompanies } from '@/lib/manage/read';
import ContactList from '@/components/lists/contact-list';
import { Suspense } from 'react';
import TableSkeleton from '@/components/ui/data-table/skeleton';

type Props = {};

const Page = async (props: Props) => {
	const [{ companies }] = await Promise.all([
		getCompanies({
			conditions: [{ parameter: { 'status/id': 1 } }],
			childConditions: [{ parameter: { 'types/id': 1 } }],
			orderBy: { key: 'name', order: 'asc' },
			fields: ['id', 'name'],
			pageSize: 1000,
		}),
	]);

	return (
		<main className='p-3'>
			<header>
				<h1>Contacts</h1>
			</header>

			<section>
				<Suspense fallback={<TableSkeleton />}>
					<ContactList
						type='table'
						params={{
							orderBy: { key: 'firstName' },
							conditions: [{ parameter: { inactiveFlag: false } }],
							childConditions: [{ parameter: { 'types/id': 17 } }, { parameter: { 'types/id': 21 } }],
							fields: ['id', 'firstName', 'lastName', 'company', 'communicationItems', 'defaultPhoneNbr'],
						}}
						facetedFilters={[{ accessoryKey: 'company', items: companies }]}
					/>
				</Suspense>
			</section>
		</main>
	);
};

export default Page;
