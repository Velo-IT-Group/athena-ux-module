import React, { Fragment } from 'react';
import Navbar from '@/components/navbar';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import TicketList from '@/components/lists/ticket-list';
import { createClient } from '@/utils/supabase/server';

type Props = {};

const Page = async (props: any) => {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<Fragment>
			<Navbar title='My issues'>
				<Fragment>
					<Link
						className={buttonVariants({ size: 'sm', variant: 'outline', className: 'text-xs h-auto py-1' })}
						href='#'
					>
						Assigned
					</Link>

					<Link
						className={buttonVariants({ size: 'sm', variant: 'outline', className: 'text-xs h-auto py-1' })}
						href='#'
					>
						Created
					</Link>
				</Fragment>
			</Navbar>

			<main className='p-6'>
				<TicketList
					definition={{ page: '' }}
					type='table'
					params={{
						conditions: {
							'owner/id': user?.user_metadata.referenceId,
						},
					}}
				/>
			</main>
		</Fragment>
	);
};

export default Page;
