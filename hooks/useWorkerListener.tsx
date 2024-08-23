'use client';
import { useEffect, useRef } from 'react';
import { Reservation, WorkerEvents, Worker } from 'twilio-taskrouter';

const useWorkerListener = (
	eventName: keyof WorkerEvents,
	handler: ((w: Worker) => Promise<void>) | ((r: Reservation) => Promise<void>),
	worker?: Worker
) => {
	if (!worker) return;
	const savedHandler = useRef(handler);

	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);
	useEffect(() => {
		const eventListener = (w: Worker | Reservation) => {
			if (eventName.includes('reservation')) {
				(savedHandler.current as (r: Reservation) => Promise<void>)(w as Reservation);
			} else {
				(savedHandler.current as (w: Worker) => Promise<void>)(w as Worker);
			}
		};
		worker.on(eventName, eventListener);

		return () => {
			worker.removeListener(eventName, eventListener);
		};
	}, [eventName, worker]);
};

export default useWorkerListener;
