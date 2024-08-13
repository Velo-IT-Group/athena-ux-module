import React from 'react';
import { Separator } from '../ui/separator';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';

type Props = {};

const CalendarList = (props: Props) => {
	const blankArray = new Array(8).fill(null);

	const hours = new Map<number, string>();

	new Array(8).fill(null).forEach((_, index) => {
		const date = new Date();
		date.setHours(index + 8);
		hours.set(index + 1, date.toISOString());
	});

	return (
		<Card className='relative h-full'>
			<CardContent className='px-0.5'>
				{blankArray.map((_, index) => {
					const date = new Date();
					date.setHours(index + 8, 0, 0, 0);
					return (
						<div
							className='grid grid-cols-[64px_1fr] gap-1.5'
							key={index}
						>
							<span className='text-xs'>{Intl.DateTimeFormat('en-us', { timeStyle: 'short' }).format(date)}</span>

							<div className='relative grid min-h-20 h-ful grid-rows-4 items-start'>
								<div className='grid gap-6 absolute h-full min-h-20'>
									<Separator />
									<Separator />
									<Separator />
									<Separator />
								</div>

								<Badge
									className='w-full flex items-start gap-1.5 rounded-md row-span-3'
									variant='secondary'
								>
									<Avatar className='h-3 w-3'>
										<AvatarFallback className='text-[9px]'>NB</AvatarFallback>
									</Avatar>

									<div>
										<p>Meeting Selena M.</p>
										<p>12-12:30 PM</p>
									</div>
								</Badge>
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
};

export default CalendarList;
