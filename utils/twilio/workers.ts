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

export const changeOnCallEngineer = async (workerSid: string, token: string): Promise<boolean> => { 
      const encodedParams = {
        workerSid,
        Token: token,
      };
 
     const res = await fetch('https://custom-flex-extensions-serverless-1420-dev.twil.io/features/on-call-engineer/flex/make-on-call-engineer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: JSON.stringify(encodedParams),
	 })

	if (!res.ok) {
		throw new Error('Failed to change on call engineer');
	}

	return true
};