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
};

const Timer = ({ timer, className }: Props) => {
	const { seconds, minutes, hours } = timer;

	return (
		<span className={cn('text-xs text-muted-foreground tabular-nums', className)}>
			{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
		</span>
	);
};

export default Timer;
