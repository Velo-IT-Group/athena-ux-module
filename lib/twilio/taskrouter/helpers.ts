import { Twilio, jwt } from 'twilio';
import { TaskListInstanceCreateOptions } from 'twilio/lib/rest/taskrouter/v1/workspace/task';

const TaskRouterCapability = jwt.taskrouter.TaskRouterCapability;

const client = new Twilio(process.env.NEXT_PUBLIC_API_KEY_SID, process.env.NEXT_PUBLIC_API_KEY_SECRET, {
	accountSid: process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
});

export const createTask = async (workflowSid: string, attributes: Object) => {
	const payload = {
		workflowSid,
		attributes: JSON.stringify(attributes),
		timeout: 3600,
		taskChannel: 'voice',
	};

	return await client.taskrouter.v1.workspaces(process.env.TWILIO_WORKSPACE_SID!).tasks.create(payload);
};

export const findWorker = async (friendlyName: string) => {
	const workers = await client.taskrouter.v1
		.workspaces(process.env.TWILIO_WORKSPACE_SID!)
		.workers.list({ friendlyName });

	return workers[0];
};

export const getOngoingTasks = (name: string) => {
	return client.taskrouter.v1.workspaces(process.env.TWILIO_WORKSPACE_SID!).tasks.list({
		assignmentStatus: ['pending', 'assigned', 'reserved'],
		evaluateTaskAttributes: "name='" + name + "'",
	});
};

const buildWorkspacePolicy = (options?: { resources: string[]; method?: string }) => {
	const resources = options?.resources || [];
	const urlComponents = ['https://taskrouter.twilio.com', 'v1', 'Workspaces', process.env.TWILIO_WORKSPACE_SID];

	return new TaskRouterCapability.Policy({
		url: urlComponents.concat(resources).join('/'),
		method: options?.method || 'GET',
		allow: true,
	});
};

export const createWorkerCapabilityToken = (sid: string) => {
	const workerCapability = new TaskRouterCapability({
		accountSid: process.env.TWILIO_ACCOUNT_SID!,
		authToken: process.env.TWILIO_AUTH_TOKEN!,
		workspaceSid: process.env.TWILIO_WORKSPACE_SID!,
		channelId: sid,
		ttl: 3600,
	});

	const eventBridgePolicies = jwt.taskrouter.util.defaultEventBridgePolicies(process.env.TWILIO_ACCOUNT_SID!, sid);

	const workspacePolicies = [
		// Workspace fetch Policy
		buildWorkspacePolicy(),
		// Workspace subresources fetch Policy
		buildWorkspacePolicy({ resources: ['**'] }),
		// Workspace resources update Policy
		buildWorkspacePolicy({ resources: ['**'], method: 'POST' }),
	];

	eventBridgePolicies.concat(workspacePolicies).forEach((policy) => {
		workerCapability.addPolicy(policy);
	});

	return workerCapability;
};
