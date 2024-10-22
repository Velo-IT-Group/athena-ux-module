'use client';
import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
	className?: string;
	timer: {
		seconds: number;
		minutes: number;
		hours: number;
	};
};

const Timer = ({ className, timer }: Props) => {
	const { seconds, minutes, hours } = timer;

	return (
		<span className={cn('text-xs text-muted-foreground tabular-nums', className)}>
			{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
		</span>
	);
};

export default Timer;
