import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react';
import { Column } from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
	setSort?: (orderBy?: { key: keyof TData; order?: 'asc' | 'desc' }) => void;
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
	setSort,
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>;
	}

	return (
		<div className={cn('flex items-center space-x-1.5', className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						size='sm'
						className='-ml-3 h-9 data-[state=open]:bg-accent'
					>
						<span>{title}</span>
						{column.getIsSorted() === 'desc' ? (
							<ArrowDown className='ml-2 h-3.5 w-3.5' />
						) : column.getIsSorted() === 'asc' ? (
							<ArrowUp className='ml-2 h-3.5 w-3.5' />
						) : (
							<ChevronsUpDown className='ml-2 h-3.5 w-3.5' />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='start'>
					<DropdownMenuItem
						onClick={() => setSort?.({ key: (column.columnDef.meta?.filterKey as keyof TData) ?? column.id })}
					>
						<ArrowUp className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
						Asc
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() =>
							setSort?.({ key: (column.columnDef.meta?.filterKey as keyof TData) ?? column.id, order: 'desc' })
						}
					>
						<ArrowDown className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
						Desc
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
						<EyeOff className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
						Hide
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
