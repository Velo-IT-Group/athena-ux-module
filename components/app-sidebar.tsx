import { Box, Building, Inbox, LucideIcon, Maximize, Tag, User } from 'lucide-react';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import Logo from '@/app/logo';
import getQueryClient from '@/app/getQueryClient';
import Link from 'next/link';

type MenuItem = {
	title: string;
	url?: string;
	icon: LucideIcon;
};

type MenuGroup = {
	label?: string;
	content: MenuItem[];
};

const sidebarContent: MenuGroup[] = [
	{
		content: [
			{
				title: 'Inbox',
				icon: Inbox,
				url: '/inbox',
			},
			{
				title: 'My Issues',
				icon: Maximize,
				url: '/my-issues',
			},
		],
	},
	{
		label: 'Organization',
		content: [
			{
				title: 'Tickets',
				icon: Tag,
				url: '/tickets/all',
			},
			{
				title: 'Companies',
				icon: Building,
				url: '/companies/all',
			},
			{
				title: 'Contacts',
				icon: User,
				url: '/contacts/all',
			},
			{
				title: 'Projects',
				icon: Box,
				url: '/projects/all',
			},
		],
	},
];

export async function AppSidebar() {
	const queryClient = getQueryClient();
	const locations = await queryClient.fetchQuery({
		queryKey: ['/system/locations'],
	});

	return (
		<Sidebar
			variant='inset'
			collapsible='icon'
		>
			<SidebarHeader className='h-12 grid items-center group-data-[collapsible=icon]:place-items-center'>
				<Logo className='group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6 h-[23px] w-[48px]' />
			</SidebarHeader>

			<SidebarContent>
				{sidebarContent.map((group, index) => (
					<SidebarGroup key={`sidebar-group-${index}`}>
						{group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}

						<SidebarGroupContent>
							<SidebarMenu>
								{group.content.map((item) => (
									<SidebarMenuItem key={`${item.title}-${item.url ?? ''}`}>
										<SidebarMenuButton asChild={item.url !== undefined}>
											{item.url ? (
												<Link href={item.url}>
													<item.icon />
													<span>{item.title}</span>
												</Link>
											) : (
												<>
													<item.icon />
													<span>{item.title}</span>
												</>
											)}
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						{/* <HistorySelector
							profile={profile!}
							initalConversations={conversations!}
							side='right'
						/> */}
					</SidebarMenuItem>
					<SidebarMenuItem>
						{/* <UserInfo
							user={user!}
							side='right'
						/> */}
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
