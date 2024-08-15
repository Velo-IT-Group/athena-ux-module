import TicketList from '@/components/lists/ticket-list';
import TableSkeleton from '@/components/ui/data-table/skeleton';
import { getBoards, getPriorities, getSystemMembers } from '@/lib/manage/read';
import { Suspense } from 'react';

type Props = {
	searchParams: {
		[key: string]: string | number;
	};
};

const Page = async ({ searchParams }: Props) => {
	const [boards, priorities, members] = await Promise.all([
		getBoards({
			conditions: [
				{ parameter: { inactiveFlag: false } },
				{ parameter: { projectFlag: false } },
				// { parameter: { 'workRole/id': ' (9, 5)' }, comparator: 'in' },
			],
			orderBy: { key: 'name' },
			fields: ['id', 'name'],
			pageSize: 1000,
		}),
		getPriorities({ fields: ['id', 'name'], orderBy: { key: 'name' }, pageSize: 1000 }),
		getSystemMembers({
			conditions: [{ parameter: { inactiveFlag: false } }],
			fields: ['id', 'firstName', 'lastName'],
			orderBy: { key: 'firstName' },
			pageSize: 1000,
		}),
	]);

	return (
		<main className='p-3 space-y-3'>
			<header className='flex items-center gap-3'>
				<h1 className='text-lg font-semibold'>Tickets</h1>
			</header>

			<section>
				<Suspense fallback={<TableSkeleton />}>
					<TicketList
						type='table'
						params={{
							conditions: [
								{ parameter: { closedFlag: false } },
								{ parameter: { parentTicketId: null }, comparator: '=' },
							],
							fields: ['id', 'summary', 'board', 'status', 'slaStatus', 'priority', 'owner'],
						}}
						facetedFilters={[
							{ accessoryKey: 'board', items: boards },
							{ accessoryKey: 'priority', items: priorities },
							{
								accessoryKey: 'owner',
								items: members.map((member) => {
									return { id: member.id, name: `${member.firstName} ${member.lastName ?? ''}` };
								}),
							},
						]}
					/>
				</Suspense>
			</section>
		</main>
	);
};

export default Page;
