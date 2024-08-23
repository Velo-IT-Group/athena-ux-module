'use client';
import { useEffect, useState } from 'react';

const useTimer = (date?: Date) => {
	const [seconds, setSeconds] = useState(date?.getSeconds() || 0);
	const [minutes, setMinutes] = useState(date?.getMinutes() || 0);
	const [hours, setHours] = useState(date?.getHours() || 0);

	useEffect(() => {
		const startTime = date || new Date();

		const interval = setInterval(() => {
			const time = Date.now() - startTime.getTime();

			const m = Math.floor((time / 1000 / 60) % 60);
			const h = Math.floor((time / (1000 * 60 * 60)) % 24);
			const s = Math.floor((time / 1000) % 60);

			setHours(h);
			setMinutes(m);
			setSeconds(s);
		}, 1000);

		return () => clearInterval(interval);
	}, [date]);

	return {
		seconds,
		minutes,
		hours,
	};
};

export default useTimer;
