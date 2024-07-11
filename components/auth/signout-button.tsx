'use client';
import { signOut } from 'next-auth/react';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export function SignOutButton() {
	const { push } = useRouter();
	return (
		<DropdownMenuItem
			onClick={async () => {
				await signOut();
				push('/login');
			}}
		>
			Signout
		</DropdownMenuItem>
	);
}
