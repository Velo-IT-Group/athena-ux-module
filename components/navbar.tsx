'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { SidebarTrigger } from './ui/sidebar';

type Props = {
	title?: string;
	children?: React.ReactNode;
};

const Navbar = ({ title = 'Dashboard', children }: Props) => {
	const params = useSearchParams();
	const { push } = useRouter();
	const pathname = usePathname();

	return (
		<nav className="flex items-center gap-1.5 px-3 py-0.5 h-12 border-b">
			<SidebarTrigger />

			<h2 className="text-sm font-medium tracking-tight">{title}</h2>

			{Array.from(params.entries()).length > 0 && (
				<Button
					variant="ghost"
					size="sm"
					onClick={() => push(pathname)}>
					<span>Clear</span>
					<X className="ml-1.5" />
				</Button>
			)}

			{children}
		</nav>
	);
};

export default Navbar;
