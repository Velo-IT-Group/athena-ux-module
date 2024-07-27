'use client';
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
import { cn } from '@/lib/utils';
import { useRecoilValue } from 'recoil';
import { activityState } from '@/atoms/twilioStateAtom';

type Props = {
	session: Session | null;
};

const UserInfo = ({ session }: Props) => {
	const currentActivity = useRecoilValue(activityState);

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
								currentActivity?.available ? 'bg-green-500' : 'bg-red-500'
							)}
						/>
					</div>

					<span>{session?.user.name}</span>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className='w-72'>
				<DropdownMenuGroup>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>

					<DropdownMenuSeparator />

					<ActivityDropdownMenuSub />

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
