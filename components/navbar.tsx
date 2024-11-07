'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { SidebarTrigger } from './ui/sidebar';

const Navbar = () => {
	const params = useSearchParams();
	const { push } = useRouter();

	return (
		<nav className='flex items-center gap-1.5 px-3 py-0.5 h-12 border-b'>
			<SidebarTrigger />
			<h2 className='text-sm font-medium tracking-tight'>Dashboard</h2>
			{Array.from(params.entries()).length > 0 && (
				<Button
					variant='ghost'
					size='sm'
					onClick={() => push('/')}
				>
					<span>Clear</span>
					<X className='ml-1.5' />
				</Button>
			)}
		</nav>
	);
};

export default Navbar;
