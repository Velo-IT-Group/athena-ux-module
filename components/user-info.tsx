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
import { Avatar, AvatarFallback } from './ui/avatar';
import { LogOut } from 'lucide-react';
import DeviceDropdownMenuSub from './device-dropdown-menu-sub';
import ActivityDropdownMenuSub from './activity-dropdown-menu-sub';
import { cn } from '@/lib/utils';
import { useRecoilValue } from 'recoil';
import { activityState } from '@/atoms/twilioStateAtom';
import ThemeDropdownSelectorSub from './theme-dropdown-selector-sub';
import type { Session } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

type Props = {
	session: Session | null;
};

const UserInfo = ({ session }: Props) => {
	const { push } = useRouter();
	const supabase = createClient();
	const currentActivity = useRecoilValue(activityState);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
				if (
					(e.target instanceof HTMLElement && e.target.isContentEditable) ||
					e.target instanceof HTMLInputElement ||
					e.target instanceof HTMLTextAreaElement ||
					e.target instanceof HTMLSelectElement
				) {
					return;
				}

				e.preventDefault();
				// setOpen((open) => !open);
			}
		};

		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, []);

	const runCommand = useCallback((command: () => unknown) => {
		// setOpen(false);
		command();
	}, []);

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
							{/* <AvatarImage src={session?.user?.image ?? undefined} /> */}
						</Avatar>

						<div
							className={cn(
								'w-2 h-2 rounded-full absolute bottom-0 border border-white right-1.5',
								currentActivity?.available ? 'bg-green-500' : 'bg-red-500'
							)}
						/>
					</div>

					<span>{session?.user.user_metadata.full_name}</span>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className='w-72'>
				<DropdownMenuGroup>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>

					<DropdownMenuSeparator />

					<ActivityDropdownMenuSub />

					<DeviceDropdownMenuSub />

					<DropdownMenuSeparator />

					<ThemeDropdownSelectorSub />

					<DropdownMenuSeparator />

					<DropdownMenuItem
						onSelect={async () => {
							await supabase.auth.signOut();
							push('/login');
						}}
					>
						<LogOut className='mr-2 h-3.5 w-3.5' />
						<span>Log out</span>
						<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserInfo;
