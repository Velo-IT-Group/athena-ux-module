import getQueryClient from '@/app/getQueryClient';
import FilterHeader from '@/components/filter-header';
import TicketList from '@/components/lists/ticket-list';
import { Company } from '@/types/manage';
import { Conditions, generateParams } from '@/utils/manage/params';
import React from 'react';

type QueryParams = Promise<{ id: string }>;

type Props = {
	params: QueryParams;
};

const Page = async ({ params }: Props) => {
	const { id } = await params;
	const client = getQueryClient();
	const companies = await client.fetchQuery<Company[]>({
		queryKey: [
			'/company/companies',
			{
				conditions: { 'status/id': 1, 'territory/id': id },
				childConditions: { 'types/id': 1 },
				orderBy: { key: 'name', order: 'asc' },
				fields: ['id'],
				pageSize: 1000,
			} as Conditions<Company>,
		],
	});

	return (
		<>
			<FilterHeader filters={[]} />

			<section className='p-3'>
				<TicketList
					definition={{ page: 'teams-tickets' }}
					type='table'
					params={{
						conditions: {
							'company/id': companies.map((c) => c.id),
							closedFlag: false,
							parentTicketId: null,
						},
						fields: ['id', 'summary', 'board', 'status', 'priority', 'owner', 'contact', 'company'],
						orderBy: { key: 'id', order: 'desc' },
					}}
				/>
			</section>
		</>
	);
};

export default Page;
