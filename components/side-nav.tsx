'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { ResizablePanel } from './ui/resizable';
import TaskList from './lists/task-list';
import { Separator } from './ui/separator';
import FavIcon from './icons/favicon';
import Logo from '@/app/logo';
import SidebarActivityList from './sidebar-activity-list';

type Props = {
	isDefaultCollapsed: boolean;
	defaultLayout?: number[];
};

const SideNav = ({ isDefaultCollapsed, defaultLayout = [15, 32, 48] }: Props) => {
	const [isCollapsed, setIsCollapsed] = useState(isDefaultCollapsed);

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
					<div className={cn('flex h-12 items-center py-0.5', isCollapsed ? 'h-12 justify-center ' : 'px-[18px] ')}>
						<Logo
							isCollapsed={isCollapsed}
							className={isCollapsed ? 'h-6 w-6' : 'h-[23px] w-[48px]'}
						/>
					</div>

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
