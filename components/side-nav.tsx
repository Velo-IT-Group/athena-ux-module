import { Button, buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LineChart, LucideIcon, Notebook, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getWorkers } from '@/lib/twilio/read';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { getActivies } from '@/lib/twilio/taskrouter/worker/helpers';
import { getWorkflows } from '@/lib/twilio/taskrouter/helpers';
import TaskList from './task-list';
import { auth } from '@/auth';
import { CommandMenu } from './command-menu';

type Props = {};

type NavLink = {
	name: string;
	href: string;
	icon: LucideIcon;
};

const links: NavLink[] = [
	{
		name: 'Contacts',
		href: '/contacts',
		icon: Notebook,
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

const bottomLinks: NavLink[] = [
	{
		name: 'Settings',
		href: '/settings',
		icon: Settings,
	},
];

const SideNav = async (props: Props) => {
	const [workers, activities, workflows, session] = await Promise.all([
		getWorkers(),
		getActivies(),
		getWorkflows(),
		auth(),
	]);

	return (
		<aside className='flex flex-col gap-3 py-1.5 border-r'>
			<section className='flex flex-col w-full border-b py-3 px-1.5'>
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'justify-start text-muted-foreground')}
						aria-label={link.name}
					>
						<link.icon className='size-3.5 mr-1.5' />

						<span>{link.name}</span>
					</Link>
					// <Tooltip key={link.href}>
					// 	<TooltipTrigger asChild>

					// 	</TooltipTrigger>

					// 	<TooltipContent
					// 		side='right'
					// 		sideOffset={5}
					// 	>
					// 		{link.name}
					// 	</TooltipContent>
					// </Tooltip>
				))}
			</section>

			<TaskList />

			<section className='space-y-1.5 px-1.5'>
				<h2 className='text-sm text-muted-foreground'>Workers</h2>

				<div className='space-y-1.5'>
					{activities.map((activity) => {
						const filteredWorkers = workers.filter((w) => w.activitySid === activity.sid);
						return (
							<>
								{filteredWorkers.length > 0 && (
									<div
										key={activity.sid}
										className='border border-green-500 rounded-lg p-1.5 space-y-1.5'
									>
										<h3 className='text-xs text-muted-foreground flex items-center gap-1.5 font-medium'>
											{activity.friendlyName}
										</h3>

										{filteredWorkers.map((worker) => (
											<div
												key={worker.sid}
												className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), '')}
											>
												<Avatar className='w-5 h-5'>
													<AvatarFallback className='text-[10px]'>NB</AvatarFallback>
												</Avatar>

												<span>{worker.friendlyName}</span>
											</div>
										))}
									</div>
								)}
							</>
						);
					})}
				</div>
			</section>
		</aside>
	);
};

export default SideNav;
