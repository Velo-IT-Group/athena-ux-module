'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { PopoverTriggerProps } from '@radix-ui/react-popover';
import { updateTicket } from '@/lib/manage/update';
import { toast } from 'sonner';
import { useHotkeys } from '@/hooks/use-hot-keys';
import { useMutation } from '@tanstack/react-query';

export type ComboBoxItem = {
	label: string | React.ReactNode;
	value: string;
};

type Props = {
	id: number;
	items: ComboBoxItem[];
	placeholder: string;
	type: 'ticket';
	path: string;
	children?: React.ReactNode;
	align?: 'center' | 'end' | 'start';
	side?: 'top' | 'right' | 'bottom' | 'left';
	value?: string;
	popoverTriggerProps?: PopoverTriggerProps;
	className?: string;
	hotkey: string;
};

export function Combobox({
	id,
	items,
	placeholder,
	type,
	path,
	children,
	align = 'start',
	side = 'bottom',
	value = '',
	popoverTriggerProps,
	className,
	hotkey,
}: Props) {
	const [open, setOpen] = useState(false);

	const handleSelect = async (newValue: any) => {
		console.log(type, id, path, value, newValue);
		try {
			switch (type) {
				case 'ticket':
					await updateTicket(id, [{ op: value ? 'replace' : newValue ? 'add' : 'remove', path, value: newValue }]);
					break;
				default:
					break;
			}
		} catch (error) {
			toast.error(`${JSON.stringify(error)}`);
		}
	};

	useHotkeys([
		[
			hotkey,
			() => {
				setOpen((open) => !open);
			},
		],
	]);

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger
				asChild={children !== undefined}
				{...popoverTriggerProps}
			>
				{children === undefined ? (
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={open}
						className='justify-between'
					>
						{value ? items.find((item) => item.value === value)?.label : placeholder}
						<ChevronsUpDown className='ml-2 h-3.5 w-3.5 shrink-0 opacity-50' />
					</Button>
				) : (
					children
				)}
			</PopoverTrigger>
			<PopoverContent
				align={align}
				className={cn('min-w-52 p-0', className)}
				side={side}
				avoidCollisions
			>
				<Command>
					<CommandInput placeholder={placeholder} />
					<CommandEmpty>Nothing found.</CommandEmpty>
					<CommandList>
						{items.map((item) => (
							<CommandItem
								key={item.value}
								value={item.value}
								onSelect={(currentValue) => {
									console.log(currentValue);
									const id = currentValue.split('-')[0];
									console.log(id);
									handleSelect(Number(id));
									setOpen(false);
								}}
							>
								<Check className={cn('mr-2 h-3.5 w-3.5', value === item.value ? 'opacity-100' : 'opacity-0')} />
								{item.label}
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
