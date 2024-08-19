'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { PopoverTriggerProps } from '@radix-ui/react-popover';

export type ComboBoxItem = {
	label: string | React.ReactNode;
	value: string;
};

type Props = {
	items: ComboBoxItem[];
	placeholder: string;
	children?: React.ReactNode;
	align?: 'center' | 'end' | 'start';
	side?: 'top' | 'right' | 'bottom' | 'left';
	value?: string;
	setValue?: React.Dispatch<React.SetStateAction<string>>;
	popoverTriggerProps?: PopoverTriggerProps;
	className?: string;
};

export function Combobox({
	items,
	placeholder,
	children,
	align = 'start',
	side = 'bottom',
	value = '',
	setValue,
	popoverTriggerProps,
	className,
}: Props) {
	const [open, setOpen] = useState(false);

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
					<CommandEmpty>No framework found.</CommandEmpty>
					<CommandList>
						{items.map((item) => (
							<CommandItem
								key={item.value}
								value={item.value}
								onSelect={(currentValue) => {
									setValue?.(value && currentValue === value ? '' : currentValue);
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
