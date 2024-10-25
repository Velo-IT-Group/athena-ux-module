import Navbar from '@/components/navbar';
import React from 'react';

type Props = {
	children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
	return (
		<>
			<Navbar title='Tickets' />
			{children}
		</>
	);
};

export default Layout;
