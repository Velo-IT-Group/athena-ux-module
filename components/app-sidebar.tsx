import { Axe, Box, Building, Calendar, FileText, Inbox, LucideIcon, Maximize, Tag, Ticket, User } from 'lucide-react';
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
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import Logo from '@/app/logo';
import getQueryClient from '@/app/getQueryClient';
import Link from 'next/link';
import { Conditions } from '@/utils/manage/params';
import { Location } from '@/types/manage';

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
	const teams = await queryClient.fetchQuery<Location[]>({
		queryKey: ['/system/locations', { conditions: { 'structureLevel/id': "'3'" } } as Conditions<Location>],
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
										<SidebarMenuButton
											tooltip={item.title}
											asChild={item.url !== undefined}
										>
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

				<SidebarGroup>
					<SidebarGroupLabel>Teams</SidebarGroupLabel>

					<SidebarGroupContent>
						<SidebarMenu>
							{teams.map((team) => (
								<SidebarMenuItem key={team.id}>
									<SidebarMenuButton
										tooltip={team.name}
										asChild
									>
										<Link href={`/teams/${team.id}`}>
											{team.name === 'Team A' ? <Calendar /> : <Axe />}
											<span>{team.name}</span>
										</Link>
									</SidebarMenuButton>
									<SidebarMenuSub>
										<SidebarMenuSubItem>
											<SidebarMenuSubButton asChild>
												<Link href={`/teams/${team.id}/tickets`}>
													<Ticket />
													<span>Tickets</span>
												</Link>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>

										<SidebarMenuSubItem>
											<SidebarMenuSubButton asChild>
												<Link href={`/teams/${team.id}/companies`}>
													<Building />
													<span>Companies</span>
												</Link>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>

										<SidebarMenuSubItem>
											<SidebarMenuSubButton asChild>
												<Link href={`/teams/${team.id}/contacts`}>
													<User />
													<span>Contacts</span>
												</Link>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>

										<SidebarMenuSubItem>
											<SidebarMenuSubButton asChild>
												<Link href={`/teams/${team.id}/proposals`}>
													<FileText />
													<span>Proposals</span>
												</Link>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									</SidebarMenuSub>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
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
