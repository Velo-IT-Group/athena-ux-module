import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import UserLayout from './user-layout';
import { TooltipProvider } from '@/components/ui/tooltip';
import Navbar from '@/components/navbar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import SideNav from '@/components/side-nav';
import { Toaster } from 'sonner';
import { cookies } from 'next/headers';
import { onLayoutChange } from './layout-actions';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/utils/supabase/server';
import { createAccessToken } from '@/lib/twilio';
import { findWorker } from '@/lib/twilio/taskrouter/helpers';
import { getContacts, getSystemMembers } from '@/lib/manage/read';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskContext } from '@/components/active-call/context';

type Props = {
	children: ReactNode;
};

const Layout = async ({ children }: Props) => {
	const supabase = createClient();
	const [
		{
			data: { session },
		},
	] = await Promise.all([supabase.auth.getSession()]);
	const cookieStore = cookies();
	const layout = cookieStore.get('react-resizable-panels:layout');
	const collapsed = cookieStore.get('react-resizable-panels:collapsed');

	const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
	const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

	if (!session || !session.user || !session.user.email) {
		redirect('/login');
	}

	if (!session.user.user_metadata.workerSid) {
		const [worker, members, contacts] = await Promise.all([
			findWorker(session.user.email),
			getSystemMembers({ conditions: [{ parameter: { officeEmail: `'${session.user.email}'` } }] }),
			getContacts({ childConditions: [{ parameter: { 'communicationItems/value': `'${session.user.email}'` } }] }),
		]);

		await supabase.auth.updateUser({
			data: {
				...session.user.user_metadata,
				workerSid: worker.sid,
				referenceId: members[0].id,
				contactId: contacts[0].id,
			},
		});
	}

	const twilioToken = await createAccessToken(
		process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID as string,
		process.env.NEXT_PUBLIC_TWILIO_API_KEY_SID as string,
		process.env.NEXT_PUBLIC_TWILIO_API_KEY_SECRET as string,
		process.env.NEXT_PUBLIC_WORKSPACE_SID as string,
		session.user.user_metadata.workerSid,
		session.user.email
	);

	return (
		<TooltipProvider>
			<UserLayout token={twilioToken}>
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
						<Navbar />

						<Separator />

						<ScrollArea className='h-[calc(100vh-49px)] flex flex-col'>
							<div className='h-full grow'>{children}</div>
						</ScrollArea>
					</ResizablePanel>
				</ResizablePanelGroup>

				<Toaster />
			</UserLayout>
		</TooltipProvider>
	);
};

export default Layout;
