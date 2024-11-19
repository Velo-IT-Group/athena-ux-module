'use client';

import * as React from 'react';
import {
	endOfMonth,
	endOfQuarter,
	format,
	startOfMonth,
	startOfQuarter,
	subDays,
	subWeeks,
} from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

export function DatePickerDemo() {
	const [date, setDate] = React.useState<Date>();

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'w-[280px] justify-start text-left font-normal',
						!date && 'text-muted-foreground'
					)}>
					<CalendarIcon className="mr-1.5 h-3 w-3" />
					{date ? format(date, 'PPP') : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}

import { DateRange } from 'react-day-picker';
import { usePathname, useRouter } from 'next/navigation';

export function DatePickerWithRange({
	className,
}: React.HTMLAttributes<HTMLDivElement>) {
	const newDate = new Date();
	const [date, setDate] = React.useState<DateRange | undefined>({
		from: subDays(newDate, 20),
		to: newDate,
	});

	return (
		<div className={cn('grid gap-1.5', className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={'outline'}
						className={cn(
							'w-[300px] justify-start text-left font-normal',
							!date && 'text-muted-foreground'
						)}>
						<CalendarIcon />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, 'LLL dd, y')} -{' '}
									{format(date.to, 'LLL dd, y')}
								</>
							) : (
								format(date.from, 'LLL dd, y')
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-auto p-0"
					align="start">
					<Calendar
						initialFocus
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={setDate}
						numberOfMonths={2}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}

export function DatePickerWithPresets({
	from,
	to,
}: {
	from?: Date;
	to?: Date;
}) {
	const today = React.useMemo(() => new Date(), []);
	const [date, setDate] = React.useState<DateRange | undefined>({
		from: from ?? subDays(today, 20),
		to: to ?? today,
	});

	const pathname = usePathname();
	const { push } = useRouter();

	React.useEffect(() => {
		if (!date?.from || !date?.to) return;
		if (
			date.from.getDate() === subDays(today, 20).getDate() &&
			today.getDate() === date.to.getDate()
		)
			return;
		const params = new URLSearchParams();
		params.set('start_date', date.from.toISOString());
		params.set('end_date', date.to.toISOString());

		push(pathname + '?' + params.toString());
	}, [date, pathname, push, today]);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					id="date"
					variant={'outline'}
					className={cn(
						'w-[300px] justify-start text-left font-normal',
						!date && 'text-muted-foreground'
					)}>
					<CalendarIcon className="mr-3" />
					{date?.from ? (
						date.to ? (
							<>
								{format(date.from, 'LLL dd, y')} -{' '}
								{format(date.to, 'LLL dd, y')}
							</>
						) : (
							format(date.from, 'LLL dd, y')
						)
					) : (
						<span>Pick a date</span>
					)}
				</Button>
			</PopoverTrigger>

			<PopoverContent
				className="flex w-auto flex-col space-y-1.5 p-1.5"
				align="start">
				<h3 className="tracking-tight font-medium text-sm text-muted-foreground">
					Presets
				</h3>

				<div className="grid grid-cols-3 gap-3 px-1.5">
					<Button
						variant="outline"
						onClick={() => {
							setDate({
								from: subWeeks(today, 1),
								to: today,
							});
						}}>
						This Week
					</Button>

					<Button
						variant="outline"
						onClick={() => {
							setDate({
								from: startOfMonth(today),
								to: endOfMonth(today),
							});
						}}>
						This Month
					</Button>

					<Button
						variant="outline"
						onClick={() => {
							setDate({
								from: startOfQuarter(today),
								to: endOfQuarter(today),
							});
						}}>
						This Quarter
					</Button>

					{/* <Button
						variant="outline"
						onClick={() => {
							setDate({
								from: subDays(todaysDate, 365),
								to: todaysDate,
							});
						}}>
						Past Year
					</Button> */}
				</div>

				{/* <h3 className="tracking-tight font-medium text-sm text-muted-foreground">
					Custom
				</h3> */}

				{/* <div className="rounded-md border">
				</div> */}
				<Calendar
					initialFocus
					mode="range"
					defaultMonth={date?.from}
					selected={date}
					onSelect={setDate}
					numberOfMonths={2}
				/>
			</PopoverContent>
		</Popover>
	);
}
