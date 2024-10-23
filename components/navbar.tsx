'use client';
import React, { ReactNode } from 'react';
import { SidebarTrigger } from './ui/sidebar';
import { NavItem } from '@/types/nav';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type Props = {
	title: string;
	items?: NavItem[];
	children?: ReactNode;
};

const Navbar = ({ title, items, children }: Props) => {
	const pathname = usePathname();
	return (
		<nav className='flex items-center gap-1.5 px-3 py-0.5 h-12 border-b'>
			<SidebarTrigger />

			<h2 className='text-sm font-medium tracking-tight'>{title}</h2>

			{items?.map((item) => (
				<Link
					key={item.title}
					href={item.href ?? ''}
				>
					<Badge
						variant='outline'
						className={cn('rounded-sm font-medium space-x-1.5', pathname === item.href && 'bg-muted')}
					>
						{item.icon && <item.icon />}
						<span>{item.title}</span>
					</Badge>
				</Link>
			))}

			{children}
		</nav>
	);
};

export default Navbar;
