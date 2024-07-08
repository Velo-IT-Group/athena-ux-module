import React from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Home, Layers, LucideIcon, NotebookText, Settings } from 'lucide-react';
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

const bottomLinks: NavLink[] = [
	{
		name: 'Settings',
		href: '/settings',
		icon: Settings,
	},
];

const SideNav = (props: Props) => {
	return (
		<aside className='flex flex-col gap-1.5 p-1.5 border-r'>
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

			<section className='mt-auto'>
				{bottomLinks.map((link) => (
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
			</section>
		</aside>
	);
};

export default SideNav;
