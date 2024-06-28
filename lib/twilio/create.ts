import { Twilio, jwt } from 'twilio';
import { WorkerListInstanceCreateOptions } from 'twilio/lib/rest/taskrouter/v1/workspace/worker';
import { createTask } from './taskrouter/helpers';

const client = new Twilio(process.env.NEXT_PUBLIC_API_KEY_SID, process.env.NEXT_PUBLIC_API_KEY_SECRET, {
	accountSid: process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
});

const TaskRouterCapability = jwt.taskrouter.TaskRouterCapability;

export const createWorker = async (friendlyName: string, attributes: WorkerListInstanceCreateOptions) => {
	return await client.taskrouter.v1
		.workspaces(process.env.NEXT_PUBLIC_WORKSPACE_SID!)
		.workers.create({ friendlyName, attributes: JSON.stringify(attributes) });
};

export const createCallback = async (attributes: Object) => {
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
