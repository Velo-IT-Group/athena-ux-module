'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import TaskList from './lists/task-list';
import Logo from '@/app/logo';
import SidebarActivityList from './sidebar-activity-list';
import HistorySelector from './history-selector';
import UserInfo from './user-info';
import { User } from '@supabase/supabase-js';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from './ui/sidebar';

type Props = {
	isDefaultCollapsed: boolean;
	defaultLayout?: number[];
	user: User;
	profile: Profile;
	conversations: Conversation[];
};

const SideNav = ({ isDefaultCollapsed, defaultLayout = [15, 32, 48], user, profile, conversations }: Props) => {
	const [isCollapsed, setIsCollapsed] = useState(isDefaultCollapsed);

	return (
		<Sidebar
			variant='inset'
			collapsible='icon'
		>
			<SidebarHeader>
				<div className={cn('flex h-12 items-center', isCollapsed ? 'justify-center ' : 'px-[18px] ')}>
					<Logo
						isCollapsed={isCollapsed}
						className={isCollapsed ? 'h-6 w-6' : 'h-[23px] w-[48px]'}
					/>
				</div>
			</SidebarHeader>

			<SidebarContent className='gap-0'>
				<TaskList isCollapsed={isCollapsed} />

				<SidebarActivityList isCollapsed={isCollapsed} />
			</SidebarContent>

			<SidebarFooter>
				<HistorySelector
					profile={profile!}
					initalConversations={conversations!}
					side='right'
					isCollapsed={isCollapsed}
				/>

				<UserInfo
					user={user!}
					isCollapsed={isCollapsed}
					side='right'
				/>
			</SidebarFooter>
		</Sidebar>
		// <ResizablePanel
		// 	minSize={12}
		// 	defaultSize={defaultLayout[0]}
		// 	maxSize={25}
		// 	collapsible
		// 	onCollapse={() => {
		// 		setIsCollapsed(true);
		// 		document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
		// 	}}
		// 	onResize={() => {
		// 		setIsCollapsed(false);
		// 		document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
		// 	}}
		// 	className={cn(isCollapsed && 'min-w-[48px] transition-all duration-300 ease-in-out')}
		// >
		// 	<ScrollArea className='flex flex-col py-3'>
		// 		<div className='flex flex-col h-[calc(100vh-24px)]'>
		// 			<div
		// 				data-collapsed={isCollapsed}
		// 				className='group flex flex-col'
		// 			>
		// <div className={cn('flex h-12 items-center py-0.5', isCollapsed ? 'justify-center ' : 'px-[18px] ')}>
		// 	<Logo
		// 		isCollapsed={isCollapsed}
		// 		className={isCollapsed ? 'h-6 w-6' : 'h-[23px] w-[48px]'}
		// 	/>
		// </div>

		// 				<div className='space-y-1.5'>
		// <TaskList isCollapsed={isCollapsed} />

		// <Separator />

		// <SidebarActivityList isCollapsed={isCollapsed} />
		// 				</div>
		// 			</div>

		// 			<div className='mt-auto flex flex-col gap-1.5 mx-1.5'>
		// <HistorySelector
		// 	profile={profile!}
		// 	initalConversations={conversations!}
		// 	side='right'
		// 	isCollapsed={isCollapsed}
		// />

		// <UserInfo
		// 	user={user!}
		// 	isCollapsed={isCollapsed}
		// 	side='right'
		// />
		// 			</div>
		// 		</div>
		// 	</ScrollArea>
		// </ResizablePanel>
	);
};

export default SideNav;
