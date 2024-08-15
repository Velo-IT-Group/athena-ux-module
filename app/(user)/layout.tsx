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
import { ScrollArea } from '@/components/ui/scroll-area';
import { getWorkers } from '@/lib/twilio/read';
import { getActivies } from '@/lib/twilio/taskrouter/worker/helpers';
import { cookies } from 'next/headers';
import { onLayoutChange } from './layout-actions';

type Props = {
	children: ReactNode;
};

const Layout = async ({ children }: Props) => {
	const [workers, activities, session] = await Promise.all([getWorkers(), getActivies(), auth()]);
	const cookieStore = cookies();
	const layout = cookieStore.get('react-resizable-panels:layout:mail');
	const collapsed = cookieStore.get('react-resizable-panels:collapsed');

	const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
	const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

	if (!session || !session.user) {
		redirect('/login');
	}

	return (
		<TooltipProvider>
			<UserLayout token={session.user.twilioToken}>
				<Navbar />

				<ResizablePanelGroup
					direction='horizontal'
					onLayout={onLayoutChange}
				>
					<SideNav
						isDefaultCollapsed={defaultCollapsed ?? true}
						defaultLayout={defaultLayout ?? [15, 32, 48]}
					/>

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
