import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Settings } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import OutboundDialerContent from './outbound-dialer-content';
import Image from 'next/image';
import ActivitySwitcher from './activity-switcher';
import DeviceSelector from './device-selector';

const Navbar = () => {
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
				<Button
					variant='ghost'
					size='icon'
				>
					<Settings className='w-3.5 h-3.5' />
				</Button>

				<DeviceSelector />

				<Sheet>
					<SheetTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
						>
							<Phone className='w-3.5 h-3.5' />
						</Button>
					</SheetTrigger>

					<OutboundDialerContent />
				</Sheet>

				<ActivitySwitcher />

				<Avatar className='w-7 h-7 ml-1.5'>
					<AvatarFallback className='text-xs'>NB</AvatarFallback>
				</Avatar>
			</div>
		</nav>
	);
};

export default Navbar;
