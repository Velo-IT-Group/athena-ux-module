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

const SideNav = ({ isDefaultCollapsed, user, profile, conversations }: Props) => {
	const [isCollapsed, setIsCollapsed] = useState(isDefaultCollapsed);

	return (
		<Sidebar
			variant='inset'
			collapsible='icon'
		>
			<SidebarHeader className='h-12 grid items-center group-data-[collapsible=icon]:place-items-center'>
				<Logo className='group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6 h-[23px] w-[48px]' />
			</SidebarHeader>

			<SidebarContent>
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
	);
};

export default SideNav;
