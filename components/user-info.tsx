import React from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Circle, Command, LogOut } from 'lucide-react';
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { auth } from '@/auth';
import DeviceDropdownMenuSub from './device-dropdown-menu-sub';

type Props = {};

const UserInfo = async (props: Props) => {
	const session = await auth();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					size='sm'
					className='w-full justify-start'
				>
					<div className='relative'>
						<Avatar className='w-7 h-7 mr-1.5'>
							<AvatarFallback>NB</AvatarFallback>
							<AvatarImage src={session?.user?.image ?? undefined} />
						</Avatar>

						<div className='w-2 h-2 rounded-full bg-green-500 absolute bottom-0 border border-white right-1.5' />
					</div>

					<span>{session?.user.name}</span>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className='w-56'>
				<DropdownMenuGroup>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>

					<DropdownMenuSeparator />

					<DeviceDropdownMenuSub />

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
