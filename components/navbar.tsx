import Image from 'next/image';
import UserInfo from './user-info';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Phone } from 'lucide-react';
import OutboundDialerContent from './outbound-dialer-content';
import { createClient } from '@/utils/supabase/server';
import HistorySelector from '@/components/history-selector';

const Navbar = async () => {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const { data: profile } = await supabase
		.from('profiles')
		.select()
		.eq('id', user?.id ?? '')
		.single();
	const { data: conversations } = await supabase
		.schema('reporting')
		.from('conversations')
		.select()
		.eq('agent', profile?.worker_sid ?? '');

	if (!profile || !conversations) return <div></div>;

	return (
		<nav className='flex items-center justify-between px-3 py-0.5 h-12'>
			<div className='flex items-center gap-3'>
				<Image
					src='/velo-logo-black.svg'
					alt='Velo logo logo'
					width={48}
					height={48}
					className='object-contain'
				/>
			</div>

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
						<OutboundDialerContent numbers={[]} />
					</PopoverContent>
				</Popover>

				<UserInfo user={user} />
			</div>
		</nav>
	);
};

export default Navbar;
