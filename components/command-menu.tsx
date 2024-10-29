'use client';
import React from 'react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Button } from './ui/button';
import { type DialogProps } from '@radix-ui/react-dialog';
import { LucideIcon, Search } from 'lucide-react';
import { useHotkeys } from '@/hooks/use-hot-keys';

type CommandItemType = {
	icon: LucideIcon;
	title: string;
};

interface Props extends DialogProps {
	items?: CommandItemType[];
}

export function CommandMenu({ ...props }: Props) {
	const [open, setOpen] = React.useState(false);

	useHotkeys([
		[
			'k',
			() => {
				setOpen((open) => !open);
			},
		],
	]);

	// React.useEffect(() => {
	// 	const down = (e: KeyboardEvent) => {
	// 		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
	// 			e.preventDefault();
	// 			setOpen((open) => !open);
	// 		}
	// 	};
	// 	document.addEventListener('keydown', down);
	// 	return () => document.removeEventListener('keydown', down);
	// }, []);

	return (
		<>
			<Button
				variant='ghost'
				size='icon'
				onClick={() => setOpen(true)}
				className='h-7 w-7'
				{...props}
			>
				<Search />
			</Button>
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
								{item.icon && <item.icon />}
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
