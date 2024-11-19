'use client';
import {
	MutationFunction,
	QueryFunction,
	useMutation,
	useQuery,
} from '@tanstack/react-query';
import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import type { PopoverContentProps } from '@radix-ui/react-popover';
import React from 'react';

type Props<TData> = {
	mutationFn: MutationFunction<TData>;
	queryFn?: QueryFunction<TData[]>;
	defaultItems?: TData[];
	popoverProps?: PopoverContentProps;
};

const DataCombobox = <T,>({
	mutationFn,
	queryFn,
	defaultItems,
	popoverProps,
}: Props<T>) => {
	const [open, setOpen] = useState(false);

	const { mutate, isPending } = useMutation({
		mutationKey: ['data'],
		mutationFn,
	});

	const { data: items, isLoading } = useQuery({
		queryKey: ['data'],
		queryFn,
	});

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					disabled={isLoading || isPending}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="justify-between">
					{/* {value
						? items.find((item) => item.value === value)?.label
						: placeholder} */}
					<ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="min-w-52 p-0"
				{...popoverProps}>
				<Command>
					<CommandInput />
					<CommandEmpty>Nothing found.</CommandEmpty>
					<CommandList>
						{defaultItems?.map((item) => (
							<CommandItem
								key={JSON.stringify(item)}
								value={JSON.stringify(item)}
								onSelect={(currentValue) => {
									console.log(currentValue);
									const id = currentValue.split('-')[0];
									console.log(id);
									mutate(id);
									setOpen(false);
								}}>
								<Check
									className={cn(
										'mr-2 h-3.5 w-3.5'
										// value === item.value
										// 	? 'opacity-100'
										// 	: 'opacity-0'
									)}
								/>
								{JSON.stringify(item)}
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default DataCombobox;
