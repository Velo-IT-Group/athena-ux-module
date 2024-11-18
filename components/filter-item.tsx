'use client';
import React, { useEffect, useState } from 'react';
import { UserCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './ui/alert-dialog';
import {
	FilterItem as ComboboxFilterItem,
	LinearCombobox,
} from './linear-combobox';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Icon from './Icon';
import { usePathname, useRouter } from 'next/navigation';

type Props = {
	filter: ComboboxFilterItem;
};

const FilterItem = ({ filter }: Props) => {
	const [open, setOpen] = useState(false);
	const [filterValues, setFilterValues] = useState<ComboboxFilterItem[]>([]);
	const pathname = usePathname();
	const { push } = useRouter();

	console.log(pathname);

	useEffect(() => {
		if (filterValues.length === 0) return;

		const query = new URLSearchParams();
		let fitlervalues = filterValues.map((filter) =>
			filter.label.toLowerCase()
		);
		query.set(filter.label.toLowerCase(), fitlervalues.toString());
		push(pathname + '?' + query.toString());
	}, [filterValues]);

	return (
		<div className="flex items-center gap-0.5 rounded-lg overflow-hidden relative h-6 text-ellipsis shrink">
			<p className="text-xs px-1.5 py-0.5 bg-muted self-stretch flex items-center gap-1">
				<Icon
					name={filter.icon}
					className="inline-block size-3"
				/>
				<span>{filter.label}</span>
			</p>

			<DropdownMenu>
				<DropdownMenuTrigger className="text-xs px-1.5 py-0.5 bg-muted self-stretch">
					is
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="start"
					className="w-auto min-w-0">
					<DropdownMenuItem>is</DropdownMenuItem>
					<DropdownMenuItem>is not</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<LinearCombobox
				filterGroups={[{ filters: filter?.values ?? [] }]}
				filterValues={filterValues}
				setFilterValues={setFilterValues}
				isValueSelector
				className="px-1.5 py-0.5 bg-muted h-auto self-stretch rounded-none"
			/>

			<AlertDialog
				open={open}
				onOpenChange={setOpen}>
				<AlertDialogTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="flex items-center min-w-0 relative text-xs h-auto w-auto rounded-none px-1.5 py-0.5 bg-muted self-stretch">
						<X />
					</Button>
				</AlertDialogTrigger>

				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction asChild>
							<Button
								onClick={async () => {
									setOpen(false);
								}}>
								Confirm
							</Button>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default FilterItem;
