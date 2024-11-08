import { ReactNode } from 'react';
import UserLayout from './user-layout';
import { Toaster } from 'sonner';
import { createClient } from '@/utils/supabase/server';
import { createAccessToken } from '@/lib/twilio';
import { findWorker } from '@/lib/twilio/taskrouter/helpers';
import { getContacts, getSystemMembers } from '@/lib/manage/read';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactQueryProvider from '@/providers/react-query';
import { redirect } from 'next/navigation';
import Navbar from '@/components/navbar';
import { Analytics } from '@vercel/analytics/react';
import getQueryClient from '../getQueryClient';
import { userHeaders } from '@/lib/utils';
import { decryptToken } from '@/utils/crypto';
import { AppSidebar } from '@/components/app-sidebar';
import WorkerToolbar from '@/components/worker-toolbar';
import { cookies } from 'next/headers';

type Props = {
	children: ReactNode;
};

const Layout = async ({ children }: Props) => {
	const queryClient = getQueryClient();
	const supabase = await createClient();

	const [
		{
			data: { user },
		},
	] = await Promise.all([supabase.auth.getUser()]);

	if (!user || !user.user_metadata || !user.email) {
		redirect('/login');
	}

	const cookieStore = await cookies();
	const layout = cookieStore.get('react-resizable-panels:layout');
	const collapsed = cookieStore.get('react-resizable-panels:collapsed');

	const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
	const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

	if (!user?.user_metadata || !user?.user_metadata?.workerSid) {
		const [worker, members, { data: contacts }] = await Promise.all([
			findWorker(user?.email ?? ''),
			getSystemMembers({ conditions: { officeEmail: `'${user?.email}'` } }),
			getContacts({ childConditions: { 'communicationItems/value': `'${user?.email}'` } }),
		]);

	// 	await supabase.auth.updateUser({
	// 		data: {
	// 			...user?.user_metadata,
	// 			workerSid: worker.sid,
	// 			referenceId: members?.[0]?.id,
	// 			contactId: contacts?.[0]?.id,
	// 		},
	// 	});
	// }

	const { data: profile } = await queryClient.fetchQuery({
		queryKey: ['profiles', user?.id],
		queryFn: async () =>
			supabase
				.from('profiles')
				.select()
				.eq('id', user?.id ?? '')
				.single(),
	});

	const { data: conversations } = await queryClient.fetchQuery({
		queryKey: ['conversations', user?.id],
		queryFn: async () =>
			await supabase
				.schema('reporting')
				.from('conversations')
				.select()
				.eq('agent', user.user_metadata?.worker_sid ?? '')
				.order('date', { ascending: false })
				.limit(25),
	});

	const twilioToken = await queryClient.fetchQuery({
		queryKey: ['accessToken'],
		queryFn: async () =>
			createAccessToken(
				process.env.TWILIO_ACCOUNT_SID as string,
				process.env.TWILIO_API_KEY_SID as string,
				process.env.TWILIO_API_KEY_SECRET as string,
				process.env.TWILIO_WORKSPACE_SID as string,
				profile?.worker_sid ?? '',
				user?.email ?? ''
			),
	});

	const cookieStore = await cookies();
	const authCookie = cookieStore.get('connect_wise:auth');

	if (authCookie) {
		const auth = JSON.parse(authCookie?.value ?? '{}');
		const token = decryptToken(auth, user.id);

		userHeaders.set(
			'Authorization',
			'Basic ' + btoa('velo+' + token.connect_wise.public_key + ':' + token.connect_wise.secret_key)
		);
	}

	if (!profile) return null;

	return (
		<ReactQueryProvider>
			<UserLayout token={twilioToken}>
				<SidebarProvider defaultOpen={false}>
					<AppSidebar />

					<SidebarInset>
						<ScrollArea className='h-[calc(100vh-24px)] flex flex-col scroll-pb-3'>
							<div className='h-full grow scroll-pb-3'>{children}</div>
						</ScrollArea>
					</SidebarInset>

					<Toaster richColors />

					<Analytics />

					<WorkerToolbar
						conversations={conversations ?? []}
					/>
		
					<AppSidebar
						conversations={conversations!}
						profile={profile!}
						user={user}
					/>
				</SidebarProvider>
			</UserLayout>
		</ReactQueryProvider>
	);
};

export default Layout;
