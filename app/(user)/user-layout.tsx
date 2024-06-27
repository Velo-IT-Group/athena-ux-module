import IncomingCall from '@/components/incoming-call';
import Navbar from '@/components/navbar';
import SideNav from '@/components/side-nav';
import { useTwilio } from '@/providers/twilio-provider';
import { ReactNode } from 'react';

type Props = {
	children: ReactNode;
};

const UserLayout = ({ children }: Props) => {
	console.log(useTwilio);
	const { worker } = useTwilio();

	return (
		<>
			<Navbar />

			<div className='grid grid-cols-[56px_1fr] grow'>
				<SideNav />

				{children}

				<IncomingCall />
			</div>
			{/* <ActiveCall /> */}
		</>
	);
};

export default UserLayout;
