import React, { ReactNode } from 'react';

type Props = {
	title?: string;
	children?: ReactNode;
};

const Navbar = ({ title = 'Dashboard', children }: Props) => {
	return (
		<nav className='flex items-center gap-1.5 px-6 py-0.5 h-12 border-b'>
			<h2 className='text-sm font-medium tracking-tight'>{title}</h2>
			{children}
		</nav>
	);
};

export default Navbar;
