'use client';
import React, { ReactNode } from 'react';
import { CommandMenu } from '@/components/command-menu';
import Navbar from '@/components/navbar';
import { TicketPlus } from 'lucide-react';

type Props = {
	children: ReactNode;
};

const Layout = ({ children }: Props) => {
	return (
		<div>
			<Navbar
				title='My issues'
				items={[
					{
						title: 'Assigned',
						href: '/my-issues/assigned',
					},
					{
						title: 'Created',
						href: '/my-issues/created',
					},
					{
						title: 'Activity',
						href: '/my-issues/activity',
					},
				]}
			/>

			{children}
		</div>
	);
};

export default Layout;
