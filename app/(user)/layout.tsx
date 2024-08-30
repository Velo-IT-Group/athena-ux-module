import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import UserLayout from './user-layout';
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
import ReactQueryProvider from '@/providers/react-query';

type Props = {
	children: ReactNode;
};

const Layout = async ({ children }: Props) => {
	const supabase = createClient();
	const [
		{
			data: { user },
		},
	] = await Promise.all([supabase.auth.getUser()]);
	const cookieStore = cookies();
	const layout = cookieStore.get('react-resizable-panels:layout');
	const collapsed = cookieStore.get('react-resizable-panels:collapsed');

	const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
	const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

	if (!user || !user.email) {
		redirect('/login');
	}

	if (!user.user_metadata.workerSid) {
		const [worker, members, contacts] = await Promise.all([
			findWorker(user.email),
			getSystemMembers({ conditions: [{ parameter: { officeEmail: `'${user.email}'` } }] }),
			getContacts({ childConditions: [{ parameter: { 'communicationItems/value': `'${user.email}'` } }] }),
		]);

		await supabase.auth.updateUser({
			data: {
				...user.user_metadata,
				workerSid: worker.sid,
				referenceId: members[0].id,
				contactId: contacts[0].id,
			},
		});
	}

	const twilioToken = await createAccessToken(
		process.env.TWILIO_ACCOUNT_SID as string,
		process.env.TWILIO_API_KEY_SID as string,
		process.env.TWILIO_API_KEY_SECRET as string,
		process.env.WORKSPACE_SID as string,
		user.user_metadata.workerSid,
		user.email
	);

	return (
		<ReactQueryProvider>
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
		</ReactQueryProvider>
	);
};

export default Layout;
