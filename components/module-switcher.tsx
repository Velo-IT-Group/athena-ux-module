'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NavItem } from '@/types/nav';

interface linkswitcherProps {
	isCollapsed: boolean;
	links: NavItem[];
}

export function ModuleSwitcher({ isCollapsed, links }: linkswitcherProps) {
	const [selectedModule, setSelectedModule] = React.useState<NavItem>(links[0]);

	return (
		<Select
			defaultValue={selectedModule.href}
			onValueChange={(e: string) => {
				const link = links.find((link) => link.href === e);
				setSelectedModule(link ?? links[0]);
			}}
		>
			<SelectTrigger
				className={cn(
					'flex items-center gap-1.5 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:shrink-0',
					isCollapsed && 'flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden'
				)}
				aria-label='Select account'
			>
				<SelectValue placeholder='Select an account'>
					{selectedModule.icon && <selectedModule.icon />}
					<span className={cn('ml-1.5', isCollapsed && 'hidden')}>{selectedModule?.title}</span>
				</SelectValue>
			</SelectTrigger>

			<SelectContent>
				{links.map((link) => (
					<SelectItem
						key={link.href}
						value={link.href ?? ''}
					>
						<div className='flex items-center gap-3 [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:shrink-0 [&_svg]:text-foreground'>
							{link.icon && <link.icon className='mr-1.5' />}
							{link.title}
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
