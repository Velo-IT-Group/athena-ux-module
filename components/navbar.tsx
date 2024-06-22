import React, { ReactNode } from 'react';
import { Button } from './ui/button';
import { CheckCircle, CheckCircle2, Phone, Settings } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Sheet, SheetTrigger } from './ui/sheet';
import OutboundDialerContent from './outbound-dialer-content';

const Navbar = () => {
	return (
		<nav className='grow flex items-center justify-between'>
			<div></div>
			<div className='flex items-center gap-1.5'>
				<Button
					variant='ghost'
					size='icon'
				>
					<Settings className='w-3.5 h-3.5' />
				</Button>

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

				<Button
					variant='ghost'
					size='icon'
				>
					<CheckCircle2 className='w-3.5 h-3.5' />
				</Button>

				<Avatar className='w-7 h-7'>
					<AvatarFallback className='text-xs'>NB</AvatarFallback>
				</Avatar>
			</div>
		</nav>
	);
};

export default Navbar;
