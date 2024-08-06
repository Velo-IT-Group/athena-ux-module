import { Button, buttonVariants } from '@/components/ui/button';
import { Building2, Circle, Home, LineChart, LucideIcon, Notebook, Server, Settings, Tags } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getWorkers } from '@/lib/twilio/read';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { getActivies } from '@/lib/twilio/taskrouter/worker/helpers';
import { getWorkflows } from '@/lib/twilio/taskrouter/helpers';
import TaskList from './task-list';
import { auth } from '@/auth';
import { ScrollArea } from './ui/scroll-area';
import { ResizablePanel } from './ui/resizable';
import { useRecoilState } from 'recoil';
import { collapsedState } from '@/atoms/sidebarStateAtom';
import ServerTaskList from './server-task-list';
import { useWorker } from '@/providers/worker-provider';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Input } from './ui/input';

type Props = {};

export type NavLink = {
	name: string;
	href: string;
	icon: LucideIcon;
};

const links: NavLink[] = [
	{
		name: 'Dashboard',
		href: '/',
		icon: Home,
	},
	{
		name: 'Contacts',
		href: '/contacts',
		icon: Notebook,
	},
	{
		name: 'Tickets',
		href: '/tickets',
		icon: Tags,
	},
	{
		name: 'Companies',
		href: '/companies',
		icon: Building2,
	},
	{
		name: 'Analytics',
		href: '/analytics',
		icon: LineChart,
	},
	{
		name: 'Settings',
		href: '/settings',
		icon: Settings,
	},
];

const SideNav = async (props: Props) => {
	const [workers, activities, session] = await Promise.all([getWorkers(), getActivies(), auth()]);
	// const [isCollapsed, setIsCollapsed] = useRecoilState(collapsedState);
	// const { worker } = useWorker();

	return (
		<ResizablePanel
			minSize={10}
			defaultSize={15}
			maxSize={25}
			// collapsible={isCollapsed}
			// onResize={() => {
			// 	setIsCollapsed(false);
			// 	document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
			// }}
			// onCollapse={() => {
			// 	setIsCollapsed(true);
			// 	document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
			// }}
		>
			<ScrollArea className='flex flex-col min-h-0 h-full border-r'>
				<aside className='flex flex-col gap-3 py-1.5 '>
					<section className='flex flex-col w-full border-b py-3 px-1.5'>
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'justify-start')}
								aria-label={link.name}
							>
								<link.icon className='size-3.5 mr-1.5' />

								<span>{link.name}</span>
							</Link>
						))}
					</section>

					<TaskList />

					<section className='space-y-1.5 px-1.5'>
						<h2 className='text-xs text-muted-foreground px-3 font-medium'>Workers</h2>

						<div className='space-y-1.5'>
							{activities.map((activity) => {
								const filteredWorkers = workers.filter((w) => w.activitySid === activity.sid);
								return (
									<Popover>
										<PopoverTrigger asChild>
											<Button variant='ghost'>
												<Circle className='stroke-none fill-green-500 h-5 w-5 mr-1.5' />
												<span>
													{activity.friendlyName} ({filteredWorkers.length})
												</span>
											</Button>
										</PopoverTrigger>

										<PopoverContent
											side='right'
											align='start'
											sideOffset={12}
											className='space-y-3'
										>
											<header>
												<h3 className='text-sm font-medium'>{activity.friendlyName}</h3>
											</header>

											<Input
												placeholder='Search here...'
												className='h-auto text-xs'
											/>

											<section>
												{filteredWorkers.map((worker) => (
													<Button
														variant='ghost'
														size='sm'
														className='w-full justify-start'
													>
														<Avatar className='w-7 h-7 mr-1.5'>
															<AvatarFallback>NB</AvatarFallback>
															<AvatarImage src={session?.user?.image ?? undefined} />
														</Avatar>

														<span>{worker.friendlyName}</span>
													</Button>
												))}
											</section>
										</PopoverContent>
									</Popover>
								);
								// return (
								// 	<>
								// 		{filteredWorkers.length > 0 && (
								// 			<div
								// 				key={activity.sid}
								// 				className='border border-green-500 rounded-lg p-1.5 space-y-1.5'
								// 			>
								// 				<h3 className='text-xs text-muted-foreground flex items-center gap-1.5 font-medium'>
								// 					{activity.friendlyName}
								// 				</h3>

								// 				{filteredWorkers.map((worker) => (
								// 					<div
								// 						key={worker.sid}
								// 						className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), '')}
								// 					>
								// 						<Avatar className='w-5 h-5'>
								// 							<AvatarFallback className='text-[10px]'>NB</AvatarFallback>
								// 						</Avatar>

								// 						<span>{worker.friendlyName}</span>
								// 					</div>
								// 				))}
								// 			</div>
								// 		)}
								// 	</>
								// );
							})}
						</div>
					</section>
				</aside>
			</ScrollArea>
		</ResizablePanel>
	);
};

export default SideNav;
