'use client';

import * as React from 'react';
import { format, subDays } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useRouter } from 'next/navigation';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
	from?: Date;
	to?: Date;
}

export function DateRangePicker({ className, from, to }: Props) {
	const { push } = useRouter();
	const [date, setDate] = React.useState<DateRange | undefined>({
		from: from ?? subDays(new Date(), 20),
		to: to ?? new Date(),
	});

	return (
		<div className={cn('grid gap-2', className)}>
			<Popover
				onOpenChange={(e) => {
					if (!e) {
						push(`/?from=${date?.from?.toISOString()}&to=${date?.to?.toISOString()}`);
					}
				}}
			>
				<PopoverTrigger asChild>
					<Button
						id='date'
						variant={'outline'}
						className={cn('w-64 justify-start text-left font-normal', !date && 'text-muted-foreground')}
					>
						<CalendarIcon className='mr-2 h-4 w-4' />

						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
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
					className='w-auto p-0'
					align='start'
				>
					<Calendar
						mode='range'
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
