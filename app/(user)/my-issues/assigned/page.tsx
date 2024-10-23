import React from 'react';
import { Button } from '@/components/ui/button';
import { ListFilter, SlidersHorizontal } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import TicketList from '@/components/lists/ticket-list';

type Props = {};

const Page = async (props: Props) => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<>
			<header className='flex items-center justify-between gap-3 h-9 px-3 border-b'>
				<Button
					size='sm'
					variant='ghost'
					className='space-x-1.5 h-6'
				>
					<ListFilter />
					<span className='text-xs'>Filter</span>
				</Button>

				<Button
					size='sm'
					variant='secondary'
					className='space-x-1.5 h-6'
				>
					<SlidersHorizontal />
					<span className='text-xs'>Filter</span>
				</Button>
			</header>

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
