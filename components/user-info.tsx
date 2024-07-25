'use client';
import React, { useState } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LogOut } from 'lucide-react';
import DeviceDropdownMenuSub from './device-dropdown-menu-sub';
import ActivityDropdownMenuSub from './activity-dropdown-menu-sub';
import type { Session } from 'next-auth';
import type { ActivityInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/activity';
import { useWorker } from '@/providers/worker-provider';
import { cn } from '@/lib/utils';

type Props = {
	session: Session | null;
	activities: ActivityInstance[];
};

const UserInfo = ({ session, activities }: Props) => {
	const { worker } = useWorker();
	const [selectedAccount, setSelectedAccount] = useState<string>(worker?.workerActivitySid ?? '');
	const selectedActivity = worker?.activities.get(selectedAccount);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					size='sm'
					className='justify-start'
				>
					<div className='relative'>
						<Avatar className='w-7 h-7 mr-1.5'>
							<AvatarFallback>NB</AvatarFallback>
							<AvatarImage src={session?.user?.image ?? undefined} />
						</Avatar>

						<div
							className={cn(
								'w-2 h-2 rounded-full absolute bottom-0 border border-white right-1.5',
								selectedActivity?.available ? 'bg-green-500' : 'bg-red-500'
							)}
						/>
					</div>

					<span>{session?.user.name}</span>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className='w-56'>
				<DropdownMenuGroup>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>

					<DropdownMenuSeparator />

					<ActivityDropdownMenuSub
						activities={activities}
						selectedAccount={selectedAccount}
						setSelectedAccount={setSelectedAccount}
						selectedActivity={selectedActivity}
					/>

					<DeviceDropdownMenuSub />

					<DropdownMenuSeparator />

					<DropdownMenuItem>
						<LogOut className='mr-2 h-4 w-4' />
						<span>Log out</span>
						<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserInfo;
