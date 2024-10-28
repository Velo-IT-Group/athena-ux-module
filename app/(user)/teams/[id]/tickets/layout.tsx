import React from 'react';
import getQueryClient from '@/app/getQueryClient';
import Navbar from '@/components/navbar';
import type { Location } from '@/types/manage';

type Props = {
	params: Promise<{ id: string }>;
	children: React.ReactNode;
};

const Layout = async ({ children, params }: Props) => {
	const { id } = await params;
	const client = getQueryClient();
	const team = await client.fetchQuery<Location>({ queryKey: [`/system/locations/${id}`] });
	console.log(team);
	return (
		<>
			<Navbar title={`${team.name}'s Tickets`} />
			{children}
		</>
	);
};

export default Layout;
