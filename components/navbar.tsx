import Image from 'next/image';
import DeviceSelector from './device-selector';
import { getAllCalls } from '@/lib/twilio/read';
import { getPhoneNumbers } from '@/lib/twilio/phoneNumbers';
import { auth } from '@/auth';
import { CommandMenu } from './command-menu';
import UserInfo from './user-info';
import { Popover, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Phone } from 'lucide-react';
import OutboundDialerContent from './outbound-dialer-content';
import HistorySelector from '@/app/(user)/history-selector';

const Navbar = async () => {
	const [numbers, calls, session] = await Promise.all([
		getPhoneNumbers(),
		getAllCalls('client:nblack_40velomethod_2Ecom'),
		auth(),
	]);

	// console.log(session);

	return (
		<nav className='flex items-center justify-between border-b px-3 py-0.5'>
			<Image
				src='/velo-logo-black.svg'
				alt='Velo logo logo'
				width={50}
				height={50}
				className='object-contain'
			/>

			<CommandMenu />

			<div className='flex items-center'>
				<HistorySelector calls={calls} />

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

				<UserInfo />
			</div>
		</nav>
	);
};

export default Navbar;
