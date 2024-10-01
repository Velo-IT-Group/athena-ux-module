'use server';
import { createClient } from '@/utils/twilio';
import { TaskContextUpdateOptions } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { ReservationContextUpdateOptions } from 'twilio/lib/rest/taskrouter/v1/workspace/task/reservation';
import { WorkerContextUpdateOptions } from 'twilio/lib/rest/taskrouter/v1/workspace/worker';
import { getWorker, getWorkers } from './read';

export const updateWorker = async (workerSid: string, options: WorkerContextUpdateOptions) => {
	const client = await createClient();
	try {
		const worker = await client.taskrouter.v1.workspaces(process.env.WORKSPACE_SID!).workers(workerSid).update(options);

		console.log(worker);
	} catch (error) {
		console.error(error);
	}
};

export const updateTask = async (taskSid: string, options: TaskContextUpdateOptions) => {
	const client = await createClient();
	try {
		const worker = await client.taskrouter.v1.workspaces(process.env.WORKSPACE_SID!).tasks(taskSid).update(options);

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
	const client = await createClient();
	const reservation = await client.taskrouter.v1
		.workspaces(process.env.WORKSPACE_SID!)
		.tasks(taskSid)
		.reservations(reservationSid)
		.update(params);

	console.log(reservation);
};

export const updateOnCallEngineer = async (workerSid: string) => {
	 const workers = await getWorkers({
      targetWorkersExpression: 'on_call == true',
    });

	if (workers.length) {
		const attributes = JSON.parse(workers[0].attributes)
		await updateWorker(workers[0].sid, {...attributes, on_call: !attributes.on_call });
	}

	const worker = await getWorker(workerSid)
	const attributes = JSON.parse(worker.attributes)
	await updateWorker(workerSid, {...attributes, on_call: !attributes.on_call });   
}