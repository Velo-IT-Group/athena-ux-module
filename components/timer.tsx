'use client';
import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
	timer: {
		seconds: number;
		minutes: number;
		hours: number;
	};
	className?: string;
	relative?: boolean;
};

const timeFormat = new Intl.RelativeTimeFormat('en-US', { style: 'short', numeric: 'always' });

const Timer = ({ timer, className, relative }: Props) => {
	const { seconds, minutes, hours } = timer;

	const formattedSeconds = timeFormat.format(seconds, 'seconds');
	const formattedMinutes = timeFormat.format(minutes, 'minutes');
	const formattedHours = timeFormat.format(hours, 'hours');

	return (
		<span className={cn('text-xs text-muted-foreground tabular-nums', className)}>
			{relative ? (
				<>
					{hours > 0 && formattedHours} {minutes > 0 && formattedMinutes} {seconds > 0 && formattedSeconds}
					{/* {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')} */}
				</>
			) : (
				<>
					{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
				</>
			)}
		</span>
	);
};

export default Timer;
