import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
	Book,
	Bot,
	Code2,
	Home,
	Layers,
	LifeBuoy,
	LucideIcon,
	NotebookText,
	Settings2,
	SquareTerminal,
	SquareUser,
	Triangle,
} from 'lucide-react';
import UserInfo from './user-info';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ActivitySwitcher from './activity-switcher';

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

const SideNav = async (props: Props) => {
	const myHeaders = new Headers();
	myHeaders.append(
		'Authorization',
		`Basic ${btoa(`${process.env.NEXT_PUBLIC_ACCOUNT_SID}:${process.env.NEXT_PUBLIC_AUTH_TOKEN}`)}`
	);

	const requestOptions: RequestInit = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow',
	};

	const response = await fetch(
		`https://taskrouter.twilio.com/v1/Workspaces/${process.env.NEXT_PUBLIC_WORKSPACE_SID}/Activities`,
		requestOptions
	);
	const { activities } = await response.json();

	return (
		<aside className='flex h-full flex-col border-r'>
			<div className='border-b p-2'>
				<ActivitySwitcher activites={activities} />
			</div>

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
