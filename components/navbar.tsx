import Image from 'next/image';
import ActivitySwitcher from './activity-switcher';
import DeviceSelector from './device-selector';
import { getAllCalls } from '@/lib/twilio/read';
import { getPhoneNumbers } from '@/lib/twilio/phoneNumbers';
import { auth, signOut } from '@/auth';
import { CommandMenu } from './command-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
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
import { Circle, Dot, LogOut } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import UserInfo from './user-info';

const Navbar = async () => {
	const [numbers, calls, session] = await Promise.all([
		getPhoneNumbers(),
		getAllCalls('client:nblack_40velomethod_2Ecom'),
		auth(),
	]);

	// console.log(session);

	return (
		<nav className='flex items-center justify-between border-b px-3 py-0.5'>
			<Image
				src='/velo-logo-black.svg'
				alt='Velo logo logo'
				width={50}
				height={50}
				className='object-contain'
			/>

			<form className='flex items-center'>
				<DeviceSelector />

				<ActivitySwitcher className='ml-1.5' />

				<CommandMenu />

				{/* <HistorySelector calls={calls} /> */}

				{/* <Popover>
					<PopoverTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
						>
							<Phone />
						</Button>
					</PopoverTrigger>

					<OutboundDialerContent
						numbers={numbers.map(({ phoneNumber, friendlyName }) => {
							return { phoneNumber, friendlyName };
						})}
					/>
				</Popover>

				<DropdownMenu>
					<DropdownMenuTrigger>
						<Avatar className='w-7 h-7 ml-1.5'>
							<AvatarFallback className='text-xs'>{session?.user?.name}</AvatarFallback>
							<AvatarImage
								src={session?.user?.image ?? undefined}
								alt='User Photo'
							/>
						</Avatar>
					</DropdownMenuTrigger>

					<DropdownMenuContent>
						<SignOutButton />
					</DropdownMenuContent>
				</DropdownMenu> */}

				<UserInfo />
			</form>
		</nav>
	);
};

export default Navbar;
