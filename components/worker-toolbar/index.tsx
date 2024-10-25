import { History, MessageSquarePlus, PhoneOutgoing, UserIcon } from 'lucide-react';
import React from 'react';
import { Separator } from '@/components/ui/separator';
import UserInfo from '@/components/user-info';
import { createClient } from '@/utils/supabase/server';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';
import OutboundDial from './outbound-dial';

type Props = {};

const WorkerToolbar = async (props: Props) => {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return null;

	const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

	if (!profile) return null;

	const { data: initialConversations } = await supabase
		.schema('reporting')
		.from('conversations')
		.select('*')
		.eq('agent', profile?.worker_sid ?? '');

	return (
		<Tabs className='flex flex-col items-center justify-end overflow-hidden border border-[#EBEBEB] bg-white shadow-sm dark:border-[#1F1F1E] dark:bg-[#111110] fixed bottom-6 right-6 rounded-2xl p-1'>
			<div className='w-full rounded-xl overflow-hidden'>
				<TabsContent
					value='user-info'
					className='bg-secondary'
				>
					<UserInfo user={user} />
				</TabsContent>

				<TabsContent value='outbound-dialer'>
					<OutboundDial />
				</TabsContent>
			</div>

			<TabsList className='z-10 flex items-center justify-center gap-x-1 bg-white p-1 dark:bg-[#111110]'>
				<TabsTrigger
					value='user-info'
					className='rounded-full hover:bg-muted data-[state=active]:bg-muted h-9 w-9'
				>
					<div className='relative'>
						<UserIcon />

						<div
							className={cn(
								'w-2 h-2 rounded-full absolute border border-white -right-0.5 -bottom-0.5',
								// activity && activityColors[activity?.name]
								'bg-green-500'
							)}
						/>
					</div>

					<span className='sr-only'>{user?.user_metadata?.full_name}</span>
				</TabsTrigger>

				<TabsTrigger
					value='call-history'
					className='rounded-full hover:bg-muted data-[state=active]:bg-muted h-9 w-9'
				>
					<History />

					<span className='sr-only'>Call History</span>
				</TabsTrigger>

				<Separator
					orientation='vertical'
					className='h-5'
				/>

				<TabsTrigger
					value='outbound-dialer'
					className='rounded-full hover:bg-muted data-[state=active]:bg-muted h-9 w-9'
				>
					<PhoneOutgoing />
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);
};

export default WorkerToolbar;
