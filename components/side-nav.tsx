import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Home, Layers, LifeBuoy, LucideIcon, NotebookText } from 'lucide-react';
import UserInfo from './user-info';
import Link from 'next/link';
import { cn } from '@/lib/utils';
type Props = {};

type NavLink = {
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
		name: 'Conversations',
		href: '/conversations',
		icon: Layers,
	},
	{
		name: 'Call History',
		href: '/history',
		icon: NotebookText,
	},
];

const SideNav = (props: Props) => {
	return (
		<aside className='flex h-full flex-col border-r'>
			<nav className='grid gap-1 p-2'>
				{links.map((link) => (
					<Tooltip key={link.href}>
						<TooltipTrigger asChild>
							<Link
								href={link.href}
								className={cn('rounded-lg bg-muted', buttonVariants({ variant: 'ghost', size: 'icon' }))}
								aria-label={link.name}
							>
								<link.icon className='size-3.5' />
							</Link>
						</TooltipTrigger>
						<TooltipContent
							side='right'
							sideOffset={5}
						>
							{link.name}
						</TooltipContent>
					</Tooltip>
				))}
			</nav>

			<nav className='mt-auto grid gap-1 p-2'>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
							className='mt-auto rounded-lg'
							aria-label='Help'
						>
							<LifeBuoy className='size-3.5' />
						</Button>
					</TooltipTrigger>
					<TooltipContent
						side='right'
						sideOffset={5}
					>
						Help
					</TooltipContent>
				</Tooltip>

				<UserInfo />
			</nav>
		</aside>
	);
};

export default SideNav;
