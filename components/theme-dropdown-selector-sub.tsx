'use client';
import React from 'react';
import {
	DropdownMenuCheckboxItem,
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
	const { setTheme, theme: activeTheme, themes } = useTheme();

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger className='capitalize'>
				<Sun className='rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-1.5' />
				<Moon className='absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-1.5' />
				{activeTheme}
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent>
				<DropdownMenuGroup>
					{themes.map((theme) => (
						<DropdownMenuCheckboxItem
							key={theme}
							checked={theme === activeTheme}
							onCheckedChange={(e) => {
								if (e) {
									setTheme(theme);
								} else {
									setTheme('system');
								}
							}}
							className='capitalize'
						>
							{theme === 'light' && <Sun className='mr-1.5' />}
							{theme === 'dark' && <Moon className='mr-1.5' />}
							{theme === 'system' && <Sun className='mr-1.5' />}
							{theme}
						</DropdownMenuCheckboxItem>
					))}
				</DropdownMenuGroup>
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
};

export default ThemeDropdownSelectorSub;
