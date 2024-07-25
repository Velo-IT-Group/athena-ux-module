import { ReactNode } from 'react';
import { JabraProvider } from '@/providers/jabra-provider';
import { createAccessToken } from '@/lib/twilio';
import { TooltipProvider } from '@/components/ui/tooltip';
import Navbar from '@/components/navbar';
import SideNav from '@/components/side-nav';
import { TwilioProvider } from '@/providers/twilio-provider';
import { WorkerProvider } from '@/providers/worker-provider';
import { DeviceProvider } from '@/providers/device-provider';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

type Props = {
	children: ReactNode;
};

const Layout = async ({ children }: Props) => {
	const session = await auth();

	if (!session || !session.user) {
		redirect('/login');
	}

	const token = await createAccessToken(
		process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID as string,
		process.env.NEXT_PUBLIC_API_KEY_SID as string,
		process.env.NEXT_PUBLIC_API_KEY_SECRET as string,
		process.env.NEXT_PUBLIC_WORKSPACE_SID as string,
		session?.user.workerSid ?? (process.env.NEXT_PUBLIC_WORKER_SID as string),
		session?.user.email ?? 'nblack@velomethod.com'
	);

	return (
		<JabraProvider>
			<TwilioProvider authToken={token}>
				<DeviceProvider authToken={token}>
					<WorkerProvider authToken={token}>
						<TooltipProvider>
							<Navbar />

							<div className='grid grid-cols-[18rem_1fr] grow min-h-0'>
								<SideNav />

								{children}
							</div>
						</TooltipProvider>
					</WorkerProvider>
				</DeviceProvider>
			</TwilioProvider>
		</JabraProvider>
	);
};

export default Layout;
