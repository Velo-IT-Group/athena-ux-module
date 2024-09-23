import UserInfo from './user-info';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Phone } from 'lucide-react';
import OutboundDialerContent from './outbound-dialer-content';
import { createClient } from '@/utils/supabase/server';
import HistorySelector from '@/components/history-selector';
import getQueryClient from '@/app/getQueryClient';
import OutboundDialer from './outbound-dialer';

const Navbar = async () => {
	const supabase = createClient();
	const queryClient = getQueryClient();
	const {
		data: { user },
	} = await queryClient.fetchQuery({ queryKey: ['user'], queryFn: () => supabase.auth.getUser() });
	const { data: profile } = await queryClient.fetchQuery({
		queryKey: ['profiles', user?.id],
		queryFn: () =>
			supabase
				.from('profiles')
				.select()
				.eq('id', user?.id ?? '')
				.single(),
	});
	const { data: conversations } = await queryClient.fetchQuery({
		queryKey: ['conversations', profile?.worker_sid],
		queryFn: () =>
			supabase
				.schema('reporting')
				.from('conversations')
				.select()
				.eq('agent', profile?.worker_sid ?? '')
				.order('date', { ascending: false }),
	});

	if (!profile || !conversations) return <div></div>;

	return (
		<nav className='flex items-center justify-between px-3 py-0.5 h-12'>
			<div className='flex items-center gap-3 text-lg font-semibold tracking-tight'>Dashboard</div>

			<div className='flex items-center'>
				<HistorySelector
					profile={profile}
					initalConversations={conversations}
				/>

				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
						>
							<Phone />
						</Button>
					</PopoverTrigger>

					<PopoverContent align='end'>
						<OutboundDialer />
					</PopoverContent>
				</Popover>

				<UserInfo user={user} />
			</div>
		</nav>
	);
};

export default Navbar;
