import Navbar from '@/components/navbar';
import React from 'react';

type Props = {
	children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
	return (
		<main>
			<Navbar
				title='Contacts'
				items={[{ title: 'All Contacts' }]}
			/>
			{children}
		</main>
	);
};

export default Layout;
