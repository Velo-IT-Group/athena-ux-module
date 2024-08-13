'use client';

import * as React from 'react';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';

type Props = {
	date?: Date | null;
	setDate?: (date: Date) => void;
	name?: string;
};

const DatePicker = ({ date, setDate, name }: Props) => {
	return (
		<>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant={'outline'}
						size={'sm'}
						className={cn('justify-start text-left font-normal text-xs', !date && 'text-muted-foreground')}
					>
						<CalendarIcon className='mr-1.5' />
						{date ? format(date, 'PPP') : <span>Pick a date</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className='w-auto p-0'
					align='start'
				>
					<Calendar
						mode='single'
						selected={date ?? new Date()}
						onSelect={(e) => (e ? setDate && setDate(e) : undefined)}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
			<input
				type='hidden'
				name={name}
				value={date?.toISOString()}
			/>
		</>
	);
};

export default DatePicker;
