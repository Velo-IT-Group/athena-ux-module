'use client';
import React, { useState } from 'react';
import { TabsList, TabsTrigger } from '../ui/tabs';
import { History, PhoneOutgoing, UserIcon, Users } from 'lucide-react';
import { Separator } from '@radix-ui/react-separator';

type Props = {};

const Tabs = (props: Props) => {
	const [selectedTab, setSelectedTab] = useState('');

	return (
		<TabsList className='z-10 flex items-center justify-center gap-x-1 bg-background p-1'>
			<TabsTrigger
				value='user-info'
				className='rounded-full hover:bg-muted data-[state=active]:bg-muted h-9 w-9 relative'
			>
				<UserIcon />

				{/* <div
						className={cn(
							'w-2 h-2 rounded-full absolute border border-white -right-0.5 -bottom-0.5',
							// activity && activityColors[activity?.name]
							'bg-green-500'
						)}
					/> */}

				{/* <span className='sr-only'>{user?.user_metadata?.full_name}</span> */}
			</TabsTrigger>

			<TabsTrigger
				value='call-history'
				className='rounded-full hover:bg-muted data-[state=active]:bg-muted h-9 w-9'
			>
				<History />

				<span className='sr-only'>Call History</span>
			</TabsTrigger>

			<TabsTrigger
				value='team-members'
				className='rounded-full hover:bg-muted data-[state=active]:bg-muted h-9 w-9'
			>
				<Users />

				<span className='sr-only'>Team Members</span>
			</TabsTrigger>

			<Separator
				orientation='vertical'
				className='h-5'
			/>

			<TabsTrigger
				value='outbound-dialer'
				className='rounded-full hover:bg-muted data-[state=active]:bg-muted h-9 w-9'
			>
				<PhoneOutgoing />
			</TabsTrigger>

			<Separator
				orientation='vertical'
				className='h-5'
			/>

			<TabsTrigger
				value=''
				className='rounded-full hover:bg-muted data-[state=active]:bg-muted h-9 w-9'
			>
				{/* <PhoneOutgoing /> */}
			</TabsTrigger>
		</TabsList>
	);
};

export default Tabs;
