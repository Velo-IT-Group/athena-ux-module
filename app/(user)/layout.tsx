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

	return (
		<TooltipProvider>
			<UserLayout token={session.user.twilioToken}>
				<Navbar />

				<ResizablePanelGroup
					direction='horizontal'
					className='grow'
				>
					<SideNav />

					<ResizableHandle />

					<ResizablePanel className='grow min-h-0'>{children}</ResizablePanel>
				</ResizablePanelGroup>

				<Toaster />
			</UserLayout>
		</TooltipProvider>
	);
};

export default Layout;
