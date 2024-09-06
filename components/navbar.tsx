import Image from 'next/image';
import UserInfo from './user-info';
import { Popover, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Phone } from 'lucide-react';
import OutboundDialerContent from './outbound-dialer-content';
import { createClient } from '@/utils/supabase/server';

const Navbar = async () => {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

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
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
						>
							<Phone />
						</Button>
					</PopoverTrigger>

					<OutboundDialerContent numbers={[]} />
				</Popover>

				<UserInfo user={user} />
			</div>
		</nav>
	);
};

export default Navbar;
