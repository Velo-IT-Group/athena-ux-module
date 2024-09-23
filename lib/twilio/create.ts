'use server';
import { WorkerListInstanceCreateOptions } from 'twilio/lib/rest/taskrouter/v1/workspace/worker';
import { createTask } from './taskrouter/helpers';
import { createClient } from '@/utils/twilio';

export const createWorker = async (friendlyName: string, attributes: Record<string, any>) => {
	const client = await createClient();

	console.log(friendlyName, attributes)

	try {
		const worker = await client.taskrouter.v1
			.workspaces(process.env.TWILIO_WORKSPACE_SID!)
			.workers.create({ friendlyName, attributes: JSON.stringify(attributes) })
		
			console.log(worker)
			return worker
	} catch (error) {
		
	}
};

export const createCallback = async (attributes: Object) => {
	const client = await createClient();
	const taskAttributes = {
		...attributes,
		title: 'Callback request',
		channel: 'callback',
	};

	try {
		const task = await createTask('', taskAttributes);

		const response = {
			taskSid: task.sid,
		};

		return response;
	} catch (error) {
		console.error(error);
		return {};
	}
};
