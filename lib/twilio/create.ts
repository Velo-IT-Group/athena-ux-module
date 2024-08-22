'use server';
import { WorkerListInstanceCreateOptions } from 'twilio/lib/rest/taskrouter/v1/workspace/worker';
import { createTask } from './taskrouter/helpers';
import { createClient } from '@/utils/twilio';

export const createWorker = async (friendlyName: string, attributes: WorkerListInstanceCreateOptions) => {
	const client = await createClient();

	return await client.taskrouter.v1
		.workspaces(process.env.WORKSPACE_SID!)
		.workers.create({ friendlyName, attributes: JSON.stringify(attributes) });
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
