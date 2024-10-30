'use client';
import React from 'react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { type DialogProps } from '@radix-ui/react-dialog';
import { Search } from 'lucide-react';
import Icon from './Icon';
import { SidebarMenuButton } from './ui/sidebar';

type CommandItemType = {
	icon: string;
	title: string;
};

interface Props extends DialogProps {
	items?: CommandItemType[];
}

export function CommandMenu({ ...props }: Props) {
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, []);

	return (
		<>
			<SidebarMenuButton
				onClick={() => setOpen(true)}
				content='Search'
				{...props}
			>
				<Search />
				<span>Command Menu</span>
			</SidebarMenuButton>
			<CommandDialog
				open={open}
				onOpenChange={setOpen}
			>
				<CommandInput placeholder='Type a command or search...' />
				<CommandList>
					<CommandGroup heading='Suggestions'>
						{props?.items?.map((item, index) => (
							<CommandItem
								className='space-x-1.5'
								key={`${index}-${item.title}`}
							>
								{item.icon && <Icon name={item.icon} />}
								<span>{item.title}</span>
							</CommandItem>
						))}
					</CommandGroup>
					<CommandEmpty>No results found.</CommandEmpty>
				</CommandList>
			</CommandDialog>
		</>
	);
}
