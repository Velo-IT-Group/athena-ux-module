'use client';
import { updateTask } from '@/lib/twilio/update';
import React, { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

type Props = {
	startTime: Date;
	taskSid?: string;
};

const Timer = ({ startTime, taskSid }: Props) => {
	const [pending, startTransition] = useTransition();
	const [seconds, setSeconds] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [hours, setHours] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			const time = Date.now() - startTime.getTime();

			const m = Math.floor((time / 1000 / 60) % 60);

			if (m >= 3 && taskSid) {
				startTransition(async () => {
					toast.dismiss(taskSid);
					await updateTask(taskSid, { assignmentStatus: 'completed', reason: 'Automatically wrapped up' });
				});
				return;
			}

			const h = Math.floor((time / (1000 * 60 * 60)) % 24);
			const s = Math.floor((time / 1000) % 60);

			setHours(h);
			setMinutes(m);
			setSeconds(s);
		}, 1000);

		return () => clearInterval(interval);
	}, [startTime, taskSid]);
	return (
		<span className='text-xs text-muted-foreground tabular-nums'>
			{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
		</span>
	);
};

export default Timer;
