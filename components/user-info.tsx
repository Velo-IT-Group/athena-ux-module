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
import { Bell, BellOff, LogOut, UserIcon } from 'lucide-react';
import DeviceDropdownMenuSub from './device-dropdown-menu-sub';
import ActivityDropdownMenuSub from './activity-dropdown-menu-sub';
import { cn } from '@/lib/utils';
import ThemeDropdownSelectorSub from './theme-dropdown-selector-sub';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './ui/alert-dialog';
import { useWorker } from '../providers/worker-provider';
import { useMutation } from '@tanstack/react-query';
import { changeOnCallEngineer } from '../utils/twilio/workers';
import { useTwilio } from '../providers/twilio-provider';
import { updateOnCallEngineer } from '@/lib/twilio/update';
import { activityColors } from './activity-item';
import { SidebarMenuButton } from './ui/sidebar';

type Props = {
	user: User | null;
	isCollapsed: boolean;
	align?: 'center' | 'end' | 'start';
	side?: 'top' | 'right' | 'bottom' | 'left';
};

const UserInfo = ({ user, isCollapsed, align = 'end', side }: Props) => {
	const { push } = useRouter();
	const supabase = createClient();
	const { worker, activity } = useWorker();
	const [attributes, setAttributes] = useState<Record<string, any>>();
	const { token } = useTwilio();

	const { mutate } = useMutation({
		mutationKey: ['changeOnCallEngineer'],
		mutationFn: () => changeOnCallEngineer(worker?.sid ?? '', token),
	});

	useEffect(() => {
		if (!worker?.attributes || Object.keys(worker.attributes).length === 0) return;
		setAttributes(worker?.attributes);
	}, [worker, worker?.attributes]);

	return (
		<AlertDialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarMenuButton size='sm'>
						<div className='relative'>
							<UserIcon />

							<div
								className={cn(
									'w-2 h-2 rounded-full absolute border border-white -right-0.5 -bottom-0.5',
									activity && activityColors[activity?.name]
								)}
							/>
						</div>

						<span>{user?.user_metadata?.full_name}</span>
					</SidebarMenuButton>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					className='w-72'
					align={align}
					side={side}
					sideOffset={12}
				>
					<DropdownMenuGroup>
						<DropdownMenuLabel>My Account</DropdownMenuLabel>

						<DropdownMenuSeparator />

						<ActivityDropdownMenuSub />

						<DeviceDropdownMenuSub />

						<DropdownMenuSeparator />

						<AlertDialogTrigger asChild>
							<DropdownMenuItem
								disabled={attributes?.on_call}
								onSelect={async () => {
									await updateOnCallEngineer(worker?.sid ?? '');
								}}
							>
								{attributes?.on_call ? <Bell className='mr-1.5' /> : <BellOff className='mr-1.5' />}
								<span>{attributes?.on_call ? 'You are on call' : 'You are not on call'}</span>
							</DropdownMenuItem>
						</AlertDialogTrigger>

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

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>You are on call</AlertDialogTitle>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={() => mutate()}>Yes, I want to go off call</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default UserInfo;
