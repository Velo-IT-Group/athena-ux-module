'use client';
import TaskList from '@/components/app-sidebar/task-list';
import ActivityList from '@/components/app-sidebar/activity-list';
import UserInfo from '@/components/app-sidebar/user-info';
import HistorySelector from '@/components/app-sidebar/history-selector';
import Logo from '@/app/logo';
import { User } from '@supabase/supabase-js';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';

type Props = {
	user: User;
	profile: Profile;
	conversations: Conversation[];
};

const AppSidebar = ({ user, profile, conversations }: Props) => {
	return (
		<Sidebar
			variant='inset'
			collapsible='icon'
		>
			<SidebarHeader className='h-12 grid items-center group-data-[collapsible=icon]:place-items-center'>
				<Logo className='group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6 h-[23px] w-[48px]' />
			</SidebarHeader>

			<SidebarContent>
				<TaskList isCollapsed={false} />

				<ActivityList isCollapsed={false} />
			</SidebarContent>

			<SidebarFooter>
				<HistorySelector
					profile={profile!}
					initalConversations={conversations!}
					side='right'
					isCollapsed={false}
				/>

				<UserInfo
					user={user!}
					isCollapsed={false}
					side='right'
				/>
			</SidebarFooter>
		</Sidebar>
	);
};

export default AppSidebar;
