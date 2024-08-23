'use client';
import React from 'react';

type Props = {
	timer: {
		seconds: number;
		minutes: number;
		hours: number;
	};
};

const Timer = ({ timer }: Props) => {
	const { seconds, minutes, hours } = timer;

	return (
		<span className='text-xs text-muted-foreground tabular-nums'>
			{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
		</span>
	);
};

export default Timer;
