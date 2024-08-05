'use client';
import React from 'react';
import {
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from './ui/dropdown-menu';
import { Moon, Sun, SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';

type Props = {};

const ThemeDropdownSelectorSub = (props: Props) => {
	const { setTheme } = useTheme();

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<Sun className='rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-1.5' />
				<Moon className='absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-1.5' />
				Theme
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent>
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => setTheme('light')}>
						<Sun className='mr-1.5' /> Light
					</DropdownMenuItem>

					<DropdownMenuItem onClick={() => setTheme('dark')}>
						<Moon className='mr-1.5' /> Dark
					</DropdownMenuItem>

					<DropdownMenuItem onClick={() => setTheme('system')}>
						<SunMoon className='mr-1.5' />
						System
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
};

export default ThemeDropdownSelectorSub;
