import { ReactNode } from 'react';
import { createAccessToken } from '@/lib/twilio';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import UserLayout from './user-layout';
import { TooltipProvider } from '@/components/ui/tooltip';
import Navbar from '@/components/navbar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import SideNav from '@/components/side-nav';
import { Toaster } from 'sonner';

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
		process.env.NEXT_PUBLIC_TWILIO_API_KEY_SID as string,
		process.env.NEXT_PUBLIC_TWILIO_API_KEY_SECRET as string,
		process.env.NEXT_PUBLIC_WORKSPACE_SID as string,
		session?.user.workerSid ?? (process.env.NEXT_PUBLIC_WORKER_SID as string),
		session?.user.email ?? 'nblack@velomethod.com'
	);

	return (
		<TooltipProvider>
			<UserLayout token={token}>
				<Navbar />

				<ResizablePanelGroup direction='horizontal'>
					<ResizablePanel
						minSize={10}
						maxSize={25}
						collapsible
					>
						<SideNav />
					</ResizablePanel>

					<ResizableHandle />

					<ResizablePanel className='grow min-h-0'>{children}</ResizablePanel>
				</ResizablePanelGroup>

				<Toaster />
			</UserLayout>
		</TooltipProvider>
	);
};

export default Layout;
