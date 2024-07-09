import { ReactNode } from 'react';
import { JabraProvider } from '@/providers/jabra-provider';
import { createAccessToken } from '@/lib/twilio';
import { TooltipProvider } from '@/components/ui/tooltip';
import Navbar from '@/components/navbar';
import SideNav from '@/components/side-nav';
import { TwilioProvider } from '@/providers/twilio-provider';

type Props = {
	children: ReactNode;
};

const Layout = async ({ children }: Props) => {
	const token = await createAccessToken(
		process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID as string,
		process.env.NEXT_PUBLIC_API_KEY_SID as string,
		process.env.NEXT_PUBLIC_API_KEY_SECRET as string,
		process.env.NEXT_PUBLIC_WORKSPACE_SID as string,
		process.env.NEXT_PUBLIC_WORKER_SID as string
	);

	return (
		<JabraProvider>
			<TwilioProvider authToken={token}>
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
