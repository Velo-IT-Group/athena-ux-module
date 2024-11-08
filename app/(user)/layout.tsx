import { ReactNode } from 'react';
import UserLayout from './user-layout';
import { Toaster } from 'sonner';
import { createClient } from '@/utils/supabase/server';
import { createAccessToken } from '@/lib/twilio';
import { findWorker } from '@/lib/twilio/taskrouter/helpers';
import { getContacts, getSystemMembers } from '@/lib/manage/read';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactQueryProvider from '@/providers/react-query';
import { redirect } from 'next/navigation';
import Navbar from '@/components/navbar';
import { Analytics } from '@vercel/analytics/react';
import getQueryClient from '../getQueryClient';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';

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

	if (!user?.user_metadata || !user?.user_metadata?.workerSid) {
		const [worker, members, { data: contacts }] = await Promise.all([
			findWorker(user?.email ?? ''),
			getSystemMembers({ conditions: { officeEmail: `'${user?.email}'` } }),
			getContacts({ childConditions: { 'communicationItems/value': `'${user?.email}'` } }),
		]);

		await supabase.auth.updateUser({
			data: {
				...user?.user_metadata,
				workerSid: worker.sid,
				referenceId: members?.[0]?.id,
				contactId: contacts?.[0]?.id,
			},
		});
	}

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

	return (
		<SidebarProvider>
			<ReactQueryProvider>
				<UserLayout token={twilioToken}>
					<AppSidebar
						conversations={conversations!}
						profile={profile!}
						user={user}
					/>

					<SidebarInset>
						<ScrollArea className='h-[calc(100vh-24px)] flex flex-col'>
							<Navbar />

							<div className='h-full grow'>{children}</div>
						</ScrollArea>
					</SidebarInset>

					<Toaster richColors />

					<Analytics />
				</UserLayout>
			</ReactQueryProvider>
		</SidebarProvider>
	);
};

export default Layout;
