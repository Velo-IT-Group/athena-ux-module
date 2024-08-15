import { columns } from '@/components/table-columns/ticket';
import { DataTable } from '@/components/ui/data-table';
import TableSkeleton from '@/components/ui/data-table/skeleton';
import { getAllTickets, getBoards, getPriorities, getStatuses, getSystemMembers } from '@/lib/manage/read';
import React, { Suspense } from 'react';

type Props = {};

const Page = async (props: Props) => {
	const [{ tickets, count }, boards, priorities, members] = await Promise.all([
		getAllTickets({
			conditions: [{ parameter: { closedFlag: false } }],
			fields: ['id', 'summary', 'board', 'status', 'priority', 'owner', 'contact'],
			pageSize: 1000,
		}),
		getBoards({
			conditions: [
				{ parameter: { inactiveFlag: false } },
				{ parameter: { projectFlag: false } },
				{ parameter: { 'workRole/id': ' (9, 5)' }, comparator: 'in' },
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
	// console.log(tickets);

	return (
		<main className='p-3'>
			<h1>Dashboard</h1>

			<section>
				<Suspense fallback={<TableSkeleton />}>
					<DataTable
						data={tickets}
						columns={columns}
						count={count}
						pageSize={25}
						facetedFilters={[
							{ accessoryKey: 'board', items: boards },
							// { accessoryKey: 'status', items: statuses },
							{ accessoryKey: 'priority', items: priorities },
							{
								accessoryKey: 'owner',
								items: members.map((member) => {
									return { id: member.id, name: `${member.firstName} ${member.lastName ?? ''}` };
								}),
							},
						]}
						meta={{ filterKey: 'summary' }}
					/>
				</Suspense>
			</section>
		</main>
	);
};

export default Page;
