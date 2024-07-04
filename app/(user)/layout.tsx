import { ReactNode } from 'react';

import IncomingCall from '@/components/incoming-call';
import SideNav from '@/components/side-nav';
import { TooltipProvider } from '@/components/ui/tooltip';
import { JabraProvider } from '@/providers/jabra-provider';
import { TwilioProvider } from '@/providers/twilio-provider';
import Navbar from '@/components/navbar';
import { ActiveCall } from '@/components/call-modal';

type Props = {
	children: ReactNode;
};

const Layout = ({ children }: Props) => {
	return (
		<JabraProvider>
			<TwilioProvider>
				<TooltipProvider>
					<Navbar />

					<div className='grid grid-cols-[56px_1fr] grow min-h-0'>
						<SideNav />

						{children}
					</div>
				</TooltipProvider>
			</TwilioProvider>
		</JabraProvider>
	);
};

export default Layout;
