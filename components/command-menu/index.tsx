'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Building, LaptopIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command';
import { DialogProps } from '@radix-ui/react-dialog';
import CommandCompaniesList from './companies';
import { Skeleton } from '../ui/skeleton';

export function CommandMenu({ ...props }: DialogProps) {
	const router = useRouter();
	const [open, setOpen] = React.useState(false);
	const { setTheme } = useTheme();
	const blankArray = new Array(6).fill(null);

	React.useEffect(() => {
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
				setOpen((open) => !open);
			}
		};

		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, []);

	const runCommand = React.useCallback((command: () => unknown) => {
		setOpen(false);
		command();
	}, []);

	return (
		<>
			<Button
				variant='outline'
				className={cn(
					'relative h-9 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64'
				)}
				onClick={() => setOpen(true)}
				{...props}
			>
				<span className='hidden lg:inline-flex'>Search documentation...</span>
				<span className='inline-flex lg:hidden'>Search...</span>
				<kbd className='pointer-events-none absolute right-1 top-1 hidden h-6 select-none items-center gap-1.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex'>
					<span className='text-xs'>⌘</span>K
				</kbd>
			</Button>

			<CommandDialog
				open={open}
				onOpenChange={setOpen}
			>
				<CommandInput placeholder='Type a command or search...' />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup
						heading='Companies'
						className='flex flex-col'
					>
						<React.Suspense
							fallback={
								<>
									{blankArray.map((_, index) => (
										<CommandItem
											key={index}
											value={''}
										>
											<Building className='mr-1.5' />
											<Skeleton className='w-full h-9 rounded-xl' />
										</CommandItem>
									))}
								</>
							}
						>
							<CommandCompaniesList router={router} />
						</React.Suspense>
					</CommandGroup>

					<CommandSeparator />
					<CommandGroup heading='Theme'>
						<CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
							<SunIcon className='mr-2 h-3.5 w-3.5' />
							Light
						</CommandItem>
						<CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
							<MoonIcon className='mr-2 h-3.5 w-3.5' />
							Dark
						</CommandItem>
						<CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
							<LaptopIcon className='mr-2 h-3.5 w-3.5' />
							System
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}
