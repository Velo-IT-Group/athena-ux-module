'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { ResizablePanel } from './ui/resizable';
import TaskList from './lists/task-list';
import { Separator } from './ui/separator';
import Logo from '@/app/logo';
import SidebarActivityList from './sidebar-activity-list';
import HistorySelector from './history-selector';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import UserInfo from './user-info';
import { Button } from './ui/button';
import { History, UserIcon } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

type Props = {
	isDefaultCollapsed: boolean;
	defaultLayout?: number[];
};

const SideNav = ({ isDefaultCollapsed, defaultLayout = [15, 32, 48] }: Props) => {
	const supabase = createClient();
	const [isCollapsed, setIsCollapsed] = useState(isDefaultCollapsed);

	const { data: user, isLoading: isUserLoading } = useQuery({
		queryKey: ['user'],
		queryFn: async () => {
			const { data, error } = await supabase.auth.getUser();
			if (error) throw new Error(error.message);
			return data.user;
		},
	});

	const { data: profile, isLoading: isProfileLoading } = useQuery({
		queryKey: ['profiles', user?.id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('profiles')
				.select()
				.eq('id', user?.id ?? '')
				.single();
			if (error) throw new Error(error.message);
			return data;
		},
	});

	const { data: conversations, isLoading: isConversationsLoading } = useQuery({
		queryKey: ['conversations', profile?.id],
		queryFn: async () => {
			const { data, error } = await supabase
				.schema('reporting')
				.from('conversations')
				.select()
				.eq('agent', profile?.worker_sid ?? '')
				.order('date', { ascending: false })
				.limit(25);
			if (error) throw new Error(error.message);
			return data;
		},
	});

	return (
		<ResizablePanel
			minSize={12}
			defaultSize={defaultLayout[0]}
			maxSize={25}
			collapsible
			onCollapse={() => {
				setIsCollapsed(true);
				document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
			}}
			onResize={() => {
				setIsCollapsed(false);
				document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
			}}
			className={cn(isCollapsed && 'min-w-[48px] transition-all duration-300 ease-in-out')}
		>
			<ScrollArea className='flex flex-col py-3'>
				<div className='flex flex-col h-[calc(100vh-24px)]'>
					<div
						data-collapsed={isCollapsed}
						className='group flex flex-col'
					>
						<div className={cn('flex h-12 items-center py-0.5', isCollapsed ? 'justify-center ' : 'px-[18px] ')}>
							<Logo
								isCollapsed={isCollapsed}
								className={isCollapsed ? 'h-6 w-6' : 'h-[23px] w-[48px]'}
							/>
						</div>

						<div className='space-y-1.5'>
							<TaskList isCollapsed={isCollapsed} />

							<Separator />

							<SidebarActivityList isCollapsed={isCollapsed} />
						</div>
					</div>

					<div className='mt-auto flex flex-col gap-1.5 mx-1.5'>
						{isProfileLoading || isConversationsLoading ? (
							<Button
								variant='ghost'
								role='combobox'
								size={isCollapsed ? 'icon' : 'sm'}
								className={cn(!isCollapsed && 'justify-start')}
								disabled
							>
								<History />
								<span className={isCollapsed ? 'sr-only' : 'ml-1.5'}>History</span>
							</Button>
						) : (
							<HistorySelector
								profile={profile!}
								initalConversations={conversations!}
								side='right'
								isCollapsed={isCollapsed}
							/>
						)}

						{isUserLoading ? (
							<Button
								variant='ghost'
								size='sm'
								className='justify-start'
								disabled
							>
								<UserIcon />

								{!isCollapsed && <Skeleton className='h-5 w-full' />}
							</Button>
						) : (
							<UserInfo
								user={user!}
								isCollapsed={isCollapsed}
								side='right'
							/>
						)}
					</div>
				</div>
			</ScrollArea>
		</ResizablePanel>
	);
};

export default SideNav;
