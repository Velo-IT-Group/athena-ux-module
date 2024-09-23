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
import { Bell, BellOff, LogOut } from 'lucide-react';
import DeviceDropdownMenuSub from './device-dropdown-menu-sub';
import ActivityDropdownMenuSub from './activity-dropdown-menu-sub';
import { cn } from '@/lib/utils';
import ThemeDropdownSelectorSub from './theme-dropdown-selector-sub';
import type { Session, User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
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

type Props = {
	user: User | null;
};

const UserInfo = ({ user }: Props) => {
	const { push } = useRouter();
	const supabase = createClient();
	const { worker } = useWorker();
	const [isAvailable, setIsAvailable] = useState(false);
	const [attributes, setAttributes] = useState<Record<string, any>>();
	const { token } = useTwilio();

	const { mutate } = useMutation({
		mutationKey: ['changeOnCallEngineer'],
		mutationFn: () => changeOnCallEngineer(worker?.sid ?? '', token),
	});

	useEffect(() => {
		if (!worker?.attributes || Object.keys(worker.attributes).length === 0) return;
		console.log(worker.attributes);
		setAttributes(worker?.attributes);
	}, [worker, worker?.attributes]);

	useEffect(() => {
		if (!worker?.activity) return;

		setIsAvailable(worker.activity.available);
	}, [worker, worker?.activity]);

	return (
		<AlertDialog>
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
									isAvailable ? 'bg-green-500' : 'bg-red-500'
								)}
							/>
						</div>

						<span>{user?.user_metadata?.full_name}</span>
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					className='w-72'
					align='end'
					forceMount
				>
					<DropdownMenuGroup>
						<DropdownMenuLabel>My Account</DropdownMenuLabel>

						<DropdownMenuSeparator />

						<ActivityDropdownMenuSub />

						<DeviceDropdownMenuSub />

						<DropdownMenuSeparator />

						<AlertDialogTrigger asChild>
							<DropdownMenuItem disabled={attributes?.on_call}>
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
