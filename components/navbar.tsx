import Image from 'next/image';
import { Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import OutboundDialerContent from './outbound-dialer-content';
import ActivitySwitcher from './activity-switcher';
import DeviceSelector from './device-selector';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import HistorySelector from '@/app/(user)/history-selector';
import { getAllCalls } from '@/lib/twilio/read';
import { getPhoneNumbers } from '@/lib/twilio/phoneNumbers';
import { auth, signOut } from '@/auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { SignOutButton } from './auth/signout-button';

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

			<form className='flex items-center'>
				<DeviceSelector />
				<ActivitySwitcher className='ml-1.5' />

				{/* <HistorySelector calls={calls} /> */}

				{/* <Popover>
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

				

				<DropdownMenu>
					<DropdownMenuTrigger>
						<Avatar className='w-7 h-7 ml-1.5'>
							<AvatarFallback className='text-xs'>{session?.user?.name}</AvatarFallback>
							<AvatarImage
								src={session?.user?.image ?? undefined}
								alt='User Photo'
							/>
						</Avatar>
					</DropdownMenuTrigger>

					<DropdownMenuContent>
						<SignOutButton />
					</DropdownMenuContent>
				</DropdownMenu> */}
			</form>
		</nav>
	);
};

export default Navbar;
