'use server';
import { createClient } from '@/utils/twilio';
import { TaskContextUpdateOptions } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { ReservationContextUpdateOptions } from 'twilio/lib/rest/taskrouter/v1/workspace/task/reservation';
import { WorkerContextUpdateOptions } from 'twilio/lib/rest/taskrouter/v1/workspace/worker';

export const updateWorker = async (workerSid: string, options: WorkerContextUpdateOptions) => {
	const client = createClient();
	try {
		const worker = await client.taskrouter.v1
			.workspaces(process.env.NEXT_PUBLIC_WORKSPACE_SID!)
			.workers(workerSid)
			.update(options);

		console.log(worker);
	} catch (error) {
		console.error(error);
	}
};

export const updateTask = async (workerSid: string, options: TaskContextUpdateOptions) => {
	const client = createClient();
	try {
		const worker = await client.taskrouter.v1
			.workspaces(process.env.NEXT_PUBLIC_WORKSPACE_SID!)
			.tasks(workerSid)
			.update(options);

		console.log(worker);
	} catch (error) {
		console.error(error);
	}
};

export const resToConference = async (
	taskSid: string,
	reservationSid: string,
	params: ReservationContextUpdateOptions = {
		instruction: 'conference',
	}
) => {
	const client = createClient();
	const reservation = await client.taskrouter.v1
		.workspaces(process.env.NEXT_PUBLIC_WORKSPACE_SID!)
		.tasks(taskSid)
		.reservations(reservationSid)
		.update(params);

	console.log(reservation);
};
