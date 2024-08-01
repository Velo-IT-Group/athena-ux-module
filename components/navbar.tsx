import Image from 'next/image';
import { getAllCalls } from '@/lib/twilio/read';
import { getPhoneNumbers } from '@/lib/twilio/phoneNumbers';
import { auth } from '@/auth';
import { CommandMenu } from './command-menu';
import UserInfo from './user-info';
import { Popover, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Phone } from 'lucide-react';
import OutboundDialerContent from './outbound-dialer-content';
import { Suspense } from 'react';
import { getActivies } from '@/lib/twilio/taskrouter/worker/helpers';
import CollapsibleButton from './collapsible-button';

const Navbar = async () => {
	const [numbers, calls, session, activities] = await Promise.all([
		getPhoneNumbers(),
		getAllCalls('client:nblack_40velomethod_2Ecom'),
		auth(),
		getActivies(),
	]);

	return (
		<nav className='flex items-center justify-between border-b px-3 py-0.5'>
			<div className='flex items-center gap-3'>
				<Image
					src='/velo-logo-black.svg'
					alt='Velo logo logo'
					width={50}
					height={50}
					className='object-contain'
				/>

				<CollapsibleButton />
			</div>

			<Suspense>
				<CommandMenu />
			</Suspense>

			<div className='flex items-center'>
				{/* <HistorySelector calls={calls} /> */}

				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
						>
							<Phone />
						</Button>
					</PopoverTrigger>

					<OutboundDialerContent
						numbers={numbers.map(({ phoneNumber, friendlyName }) => {
							return { phoneNumber, friendlyName };
						})}
					/>
				</Popover>

				<UserInfo session={session} />
			</div>
		</nav>
	);
};

export default Navbar;
