import Navbar from '@/components/navbar';
import React from 'react';

type Props = {
	children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
	return (
		<>
			<Navbar title='Contacts' />
			<main>{children}</main>
		</>
	);
};

export default Layout;
