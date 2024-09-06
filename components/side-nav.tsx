'use client';
import { useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { ResizablePanel } from './ui/resizable';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import TaskList from './lists/task-list';
import { Separator } from './ui/separator';
import { usePathname } from 'next/navigation';
import { linksConfig } from '@/config/links';
import SidebarActivityList from './sidebar-activity-list';
import FavIcon from './icons/favicon';

type Props = {
	isDefaultCollapsed: boolean;
	defaultLayout?: number[];
};

const SideNav = ({ isDefaultCollapsed, defaultLayout = [15, 32, 48] }: Props) => {
	const [isCollapsed, setIsCollapsed] = useState(isDefaultCollapsed);
	const pathname = usePathname();

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
						<FavIcon />
					</div>

					{/* <Separator /> */}

					{/* <nav className='grid gap-1.5 px-1.5 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-1.5 group-[[data-collapsed=true]]:py-1.5'>
						{linksConfig.sidebarNav.map((link, index) =>
							isCollapsed ? (
								<Tooltip
									key={index}
									delayDuration={0}
								>
									<TooltipTrigger asChild>
										<Link
											href={link.href ?? '#'}
											className={cn(
												buttonVariants({ variant: pathname === link.href ? 'default' : 'ghost', size: 'icon' }),
												'h-9 w-9'
											)}
										>
											{link.icon && <link.icon className='h-3.5 w-3.5' />}
											<span className='sr-only'>{link.title}</span>
										</Link>
									</TooltipTrigger>

									<TooltipContent
										side='right'
										className='flex items-center gap-3'
									>
										{link.title}
									</TooltipContent>
								</Tooltip>
							) : (
								<Link
									key={index}
									href={link.href ?? '#'}
									className={cn(
										buttonVariants({ variant: pathname === link.href ? 'default' : 'ghost', size: 'sm' }),
										'justify-start'
									)}
								>
									{link.icon && <link.icon className='mr-1.5 h-3.5 w-3.5' />}
									{link.title}
								</Link>
							)
						)}
					</nav> */}

					<div className='space-y-1.5'>
						<TaskList isCollapsed={isCollapsed} />

						<Separator />

						<SidebarActivityList isCollapsed={isCollapsed} />
					</div>
				</div>
			</ScrollArea>
		</ResizablePanel>
	);
};

export default SideNav;
