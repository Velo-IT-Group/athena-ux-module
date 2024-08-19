'use client';
import { buttonVariants } from '@/components/ui/button';
import { Building2, Home, LineChart, LucideIcon, Notebook, Settings, Tags } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { ResizablePanel } from './ui/resizable';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useRecoilState } from 'recoil';
import { collapsedState } from '@/atoms/sidebarStateAtom';
import { useEffect } from 'react';
import TaskList from './lists/task-list';
import { Separator } from './ui/separator';
import { usePathname } from 'next/navigation';
import { ModuleSwitcher } from './module-switcher';
import { linksConfig } from '@/config/links';

type Props = {
	isDefaultCollapsed: boolean;
	defaultLayout?: number[];
};

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

const SideNav = ({ isDefaultCollapsed, defaultLayout = [15, 32, 48] }: Props) => {
	const [isCollapsed, setIsCollapsed] = useRecoilState(collapsedState);
	const pathname = usePathname();

	useEffect(() => {
		setIsCollapsed(isDefaultCollapsed);
	}, []);

	return (
		<ResizablePanel
			minSize={12}
			defaultSize={defaultLayout[0]}
			maxSize={25}
			collapsible
			onCollapse={() => {
				setIsCollapsed(true);
				document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
			}}
			onResize={() => {
				setIsCollapsed(false);
				document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
			}}
			className={cn(isCollapsed && 'min-w-[48px] transition-all duration-300 ease-in-out')}
		>
			<ScrollArea className='flex flex-col h-screen'>
				<div
					data-collapsed={isCollapsed}
					className='group flex flex-col'
				>
					<div className={cn('flex h-12 items-center justify-center py-0.5', isCollapsed ? 'h-12' : 'px-1.5')}>
						<ModuleSwitcher
							isCollapsed={isCollapsed}
							links={linksConfig.modules}
						/>
					</div>

					<Separator />

					<nav className='grid gap-1.5 px-1.5 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-1.5 group-[[data-collapsed=true]]:py-1.5'>
						{links.map((link, index) =>
							isCollapsed ? (
								<Tooltip
									key={index}
									delayDuration={0}
								>
									<TooltipTrigger asChild>
										<Link
											href={link.href}
											className={cn(
												buttonVariants({ variant: pathname === link.href ? 'default' : 'ghost', size: 'icon' }),
												'h-9 w-9'
												// link.variant === 'default' &&
												// 	'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
											)}
										>
											<link.icon className='h-3.5 w-3.5' />
											<span className='sr-only'>{link.name}</span>
										</Link>
									</TooltipTrigger>

									<TooltipContent
										side='right'
										className='flex items-center gap-3'
									>
										{link.name}
										{/* {link.name && <span className='ml-auto text-muted-foreground'>{link.name}</span>} */}
									</TooltipContent>
								</Tooltip>
							) : (
								<Link
									key={index}
									href={link.href}
									className={cn(
										buttonVariants({ variant: pathname === link.href ? 'default' : 'ghost', size: 'sm' }),
										// link.variant === 'default' &&
										// 	'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
										'justify-start'
									)}
								>
									<link.icon className='mr-1.5 h-3.5 w-3.5' />
									{link.name}
									{/* {link.name && (
										<span
											className={cn(
												'ml-auto'
												// link.variant === 'default' && 'text-background dark:text-white'
											)}
										>
											{link.name}
										</span>
									)} */}
								</Link>
							)
						)}
					</nav>

					<Separator />

					<TaskList isCollapsed={isCollapsed} />
				</div>
			</ScrollArea>
		</ResizablePanel>
	);
};

export default SideNav;
