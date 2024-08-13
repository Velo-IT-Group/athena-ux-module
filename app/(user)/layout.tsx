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
import Toolbar from './toolbar';
import { ScrollArea } from '@/components/ui/scroll-area';

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

				<ResizablePanelGroup direction='horizontal'>
					<SideNav />

					<ResizableHandle />

					<ResizablePanel>
						<ScrollArea className='h-[calc(100vh-48px)]'>{children}</ScrollArea>
					</ResizablePanel>
				</ResizablePanelGroup>

				{/* <Toolbar /> */}

				<Toaster />
			</UserLayout>
		</TooltipProvider>
	);
};

export default Layout;
