'use client';
import React, { ReactNode } from 'react';
import { SidebarTrigger } from './ui/sidebar';
import { NavItem } from '@/types/nav';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

type Props = {
	title: string;
	items?: NavItem[];
	children?: ReactNode;
};

const Navbar = ({ title, items, children }: Props) => {
	const pathname = usePathname();
	return (
		<nav className='flex items-center gap-1.5 px-3 py-0.5 h-12 border-b space-y-0'>
			<SidebarTrigger />

			<h2 className='text-sm font-medium tracking-tight'>{title}</h2>

			{items?.map((item) => (
				<Link
					key={item.title}
					href={item.href ?? ''}
					className='block h-[22px]'
				>
					<Badge
						variant='outline'
						className={cn(
							'rounded-sm font-medium space-x-1.5 h-[22px]'
							// pathname === item.href && 'bg-muted'
						)}
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
