'use client';
import { useEffect, useState } from 'react';

const useTimer = (date?: Date) => {
	const [seconds, setSeconds] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [hours, setHours] = useState(0);

	useEffect(() => {
		const startTime = date ?? new Date();
		const time = Date.now() - startTime.getTime();

		const m = Math.floor((time / 1000 / 60) % 60);
		const h = Math.floor((time / (1000 * 60 * 60)) % 24);
		const s = Math.floor((time / 1000) % 60);

		setHours(h);
		setMinutes(m);
		setSeconds(s * 1);
		const interval = setInterval(() => {
			const time = Date.now() - startTime.getTime();

			const m = Math.floor((time / 1000 / 60) % 60);
			const h = Math.floor((time / (1000 * 60 * 60)) % 24);
			const s = Math.floor((time / 1000) % 60);

			setHours(h);
			setMinutes(m);
			setSeconds(s * 1);
		}, 500);

		return () => clearInterval(interval);
	}, []);

	return {
		seconds,
		minutes,
		hours,
	};
};

export default useTimer;
