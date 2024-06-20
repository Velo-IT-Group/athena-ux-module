import { ReactNode } from 'react';

import IncomingCall from '@/components/incoming-call';
import { ActiveCall } from '@/components/call-modal';
import SideNav from '@/components/side-nav';
import { TooltipProvider } from '@/components/ui/tooltip';
import { JabraProvider } from '@/providers/jabra-provider';
import { TwilioProvider } from '@/providers/twilio-provider';

type Props = {
	children: ReactNode;
};

const Layout = ({ children }: Props) => {
	return (
		<JabraProvider>
			<TwilioProvider>
				<TooltipProvider>
					<div className='grid grid-cols-[56px_1fr]'>
						<SideNav />
						{children}
						{/* <IncomingCall /> */}
					</div>
					<ActiveCall />
				</TooltipProvider>
			</TwilioProvider>
		</JabraProvider>
	);
};

export default Layout;
