import React from 'react';
import { createClient } from '@/utils/supabase/server';
import TicketList from '@/components/lists/ticket-list';
import FilterHeader from '@/components/filter-header';

type Props = {};

const Page = async (props: Props) => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<>
			<FilterHeader filters={[]} />

			<section className='p-3'>
				<TicketList
					type='table'
					definition={{ page: 'my-issues/assigned' }}
					params={{
						conditions: { 'owner/id': user?.user_metadata.referenceId },
						fields: ['id', 'summary', 'board', 'status', 'contact', 'company', 'slaStatus', 'priority', 'owner'],
					}}
				/>
			</section>
		</>
	);
};

export default Page;
