import Image from 'next/image';
import { Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import OutboundDialerContent from './outbound-dialer-content';
import ActivitySwitcher from './activity-switcher';
import DeviceSelector from './device-selector';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import HistorySelector from '@/app/(user)/history-selector';
import { getAllCalls } from '@/lib/twilio/read';
import { getPhoneNumbers } from '@/lib/twilio/phoneNumbers';

const Navbar = async () => {
	const [numbers, calls] = await Promise.all([getPhoneNumbers(), getAllCalls('client:nblack_40velomethod_2Ecom')]);

	return (
		<nav className='flex items-center justify-between border-b px-3 py-0.5'>
			<Image
				src='/velo-logo-black.svg'
				alt='Velo logo logo'
				width={50}
				height={50}
				className='object-contain'
			/>

			<div className='flex items-center'>
				<DeviceSelector />

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

				<ActivitySwitcher className='ml-1.5' />

				<Avatar className='w-7 h-7 ml-1.5'>
					<AvatarFallback className='text-xs'>NB</AvatarFallback>
				</Avatar>
			</div>
		</nav>
	);
};

export default Navbar;
