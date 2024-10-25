import React from 'react';
import TicketList from '@/components/lists/ticket-list';
import FilterHeader from '@/components/filter-header';

type Props = {};

const Page = async (props: Props) => {
	return (
		<>
			<FilterHeader filters={[]} />

			<section className='p-3'>
				<TicketList
					type='table'
					definition={{ page: 'my-issues/created' }}
					params={{
						orderBy: { key: 'id', order: 'desc' },
						conditions: { enteredBy: '"nblack"' },
						fields: ['id', 'summary', 'board', 'status', 'contact', 'company', 'slaStatus', 'priority', 'owner'],
					}}
				/>
			</section>
		</>
	);
};

export default Page;
