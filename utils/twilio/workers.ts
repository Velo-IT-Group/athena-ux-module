'use client';
import React from 'react';
import { toast } from 'sonner';
import { Reservation, Task, Worker } from 'twilio-taskrouter';
import type { ICallControl } from '@gnaudio/jabra-js';
import TaskWrapup from '@/components/task/wrapup';

export const onWorkerReady = async (
	w: Worker,
	setReservation: React.Dispatch<React.SetStateAction<Reservation | undefined>>,
	setTask: React.Dispatch<React.SetStateAction<Task | undefined>>,
	setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>,
	currentCallControl: ICallControl | undefined
) => {
	console.log('Worker Ready', w.sid);

	const ress = Array.from(w.reservations.values());

	ress.forEach((res) => {
		switch (res.status) {
			case 'wrapping':
				setReservation(res);
				setTask(res.task);

				// toast.custom(() => <TaskWrapup />, {
				// 	important: true,
				// 	duration: res.timeout * 1000,
				// 	id: res.task.sid,
				// });
				break;
			default:
				setReservations((prev) => [...prev.filter((r) => r.sid !== res.sid), res]);

				break;
		}
	});
};
