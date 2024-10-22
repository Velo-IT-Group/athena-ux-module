import { Circle, LucideIcon, Phone, Voicemail } from 'lucide-react';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from '@/components/ui/sidebar';
import { getOngoingTasks } from '@/lib/twilio/taskrouter/helpers';
import { createClient } from '@/utils/supabase/server';
import { cn } from '@/lib/utils';
import Logo from '@/app/logo';
import { getActivies } from '@/lib/twilio/taskrouter/worker/helpers';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import OutboundDialer from './outbound-dialer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

const activityColors: Record<string, string> = {
	Available: 'bg-green-500',
	Unavailable: 'bg-red-500',
	Offline: 'bg-gray-500',
	Break: 'bg-gray-500',
	'On-Site': 'bg-orange-500',
};

type MenuItem = {
	title: string;
	url?: string;
	icon: LucideIcon;
};

type MenuGroup = {
	label: string;
	content: MenuItem[];
};

export async function AppSidebar() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return;

	const { data, error } = await supabase.from('profiles').select().eq('id', user?.id).single();

	if (!data) return;

	const tasks = await getOngoingTasks({ routingTarget: data.worker_sid ?? '' });
	const activites = await getActivies();
	return (
		<Sidebar
			variant='inset'
			collapsible='icon'
		>
			<Collapsible
				defaultOpen
				className='group/collapsible'
			>
				<SidebarHeader className=' h-12 grid items-center group-data-[collapsible=icon]:place-items-center'>
					<Logo className='group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6 h-[23px] w-[48px]' />
				</SidebarHeader>

				<SidebarContent>
					<SidebarSeparator />

					<SidebarGroup>
						<SidebarGroupLabel>Tasks</SidebarGroupLabel>

						<SidebarGroupContent>
							<SidebarMenu>
								<SidebarMenuItem>
									<Popover>
										<PopoverTrigger asChild>
											<SidebarMenuButton>
												<Phone className='fill-current stroke-none' />
												<span>Outbound Dialer</span>
											</SidebarMenuButton>
										</PopoverTrigger>

										<PopoverContent
											align='start'
											side='right'
											sideOffset={12}
										>
											<OutboundDialer />
										</PopoverContent>
									</Popover>
								</SidebarMenuItem>

								{tasks.map((task) => {
									const voiceChannels = ['voice', 'default'];
									const isCall = voiceChannels.includes(task.taskChannelUniqueName);
									const attributes = JSON.parse(task.attributes);

									return (
										<SidebarMenuItem>
											<SidebarMenuButton>
												{isCall ? <Phone /> : <Voicemail />}
												<span>{attributes.name}</span>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>

					<SidebarSeparator />

					<SidebarGroup>
						<SidebarGroupLabel>Activities</SidebarGroupLabel>

						<SidebarGroupContent>
							<SidebarMenu>
								{activites.map((activity) => (
									<SidebarMenuItem>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton>
												<Circle
													className={cn(
														'stroke-none rounded-full group-data-[collapsible=icon]:mr-1.5',
														activityColors[activity.friendlyName]
													)}
												/>
												<span>{activity.friendlyName}</span>
											</SidebarMenuButton>
										</CollapsibleTrigger>

										<CollapsibleContent></CollapsibleContent>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</Collapsible>
		</Sidebar>
	);
}
