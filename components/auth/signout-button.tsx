'use client';
import { signOut } from 'next-auth/react';
import { DropdownMenuItem } from '../ui/dropdown-menu';

export function SignOutButton() {
	return <DropdownMenuItem onClick={() => signOut()}>Signout</DropdownMenuItem>;
}
