'use server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createTwilioClient } from '@/utils/twilio';
import { revalidatePath, unstable_cache } from 'next/cache';
import { Twilio, jwt } from 'twilio';
import { ActivityListInstanceOptions } from 'twilio/lib/rest/taskrouter/v1/workspace/activity';
import {
	TaskContextUpdateOptions,
	TaskInstance,
	TaskListInstanceOptions,
} from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { ReservationContextUpdateOptions } from 'twilio/lib/rest/taskrouter/v1/workspace/task/reservation';
import { TaskQueueListInstanceOptions } from 'twilio/lib/rest/taskrouter/v1/workspace/taskQueue';
import { WorkflowListInstanceOptions } from 'twilio/lib/rest/taskrouter/v1/workspace/workflow';

const TaskRouterCapability = jwt.taskrouter.TaskRouterCapability;

export const getTask = async (taskSid: string, params?: TaskListInstanceOptions) => {
	const client = await createTwilioClient();
	return await client.taskrouter.v1.workspaces(process.env.WORKSPACE_SID!).tasks(taskSid).fetch();
};

export const updateTask = async (taskSid: string, options: TaskContextUpdateOptions) => {
	const client = await createTwilioClient();
	const task = await client.taskrouter.v1.workspaces(process.env.WORKSPACE_SID!).tasks(taskSid).update(options);

	revalidatePath('/conversations');
	revalidatePath('/conversations/:path*');
	return task;
};

export const findWorker = async (friendlyName: string) => {
	const client = await createTwilioClient();
	const workers = await client.taskrouter.v1.workspaces(process.env.WORKSPACE_SID!).workers.list({ friendlyName });

	return workers[0];
};

export const getEvents = async () => {
	const client = await createTwilioClient();
	return await client.taskrouter.v1.workspaces(process.env.WORKSPACE_SID!).events.list({ limit: 20 });
};

export const getOngoingTasks = async () => {
	const client = await createTwilioClient();
	return await client.taskrouter.v1.workspaces(process.env.WORKSPACE_SID!).tasks.list({
		assignmentStatus: ['pending', 'assigned', 'reserved'],
		// evaluateTaskAttributes: "name='" + name + "'",
	});
};

const buildWorkspacePolicy = (options?: { resources: string[]; method?: string }) => {
	const resources = options?.resources || [];
	const urlComponents = ['https://taskrouter.twilio.com', 'v1', 'Workspaces', process.env.WORKSPACE_SID];

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
		workspaceSid: process.env.WORKSPACE_SID!,
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

export const getWorkflows = async () => {
	const client = await createTwilioClient();
	return client.taskrouter.v1.workspaces(process.env.WORKSPACE_SID!).workflows.list();
};

export const updateWorkerReservation = async (id: string, update: ReservationContextUpdateOptions) => {
	const client = await createTwilioClient();
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return await client.taskrouter.v1
		.workspaces(process.env.WORKSPACE_SID!)
		.workers(user?.user_metadata?.workerSid)
		.reservations(id)
		.update(update);
};

export const listWorkflows = async (option: WorkflowListInstanceOptions = {}) => {
	const client = await createTwilioClient();
	return await client.taskrouter.v1.workspaces(process.env.WORKSPACE_SID!).workflows.list(option);
};

export const fetchWorkflow = async (sid: string) => {
	const client = await createTwilioClient();
	return await client.taskrouter.v1.workspaces(process.env.WORKSPACE_SID!).workflows(sid).fetch();
};

export const listQueues = async (option: TaskQueueListInstanceOptions = {}) => {
	const client = await createTwilioClient();
	return await client.taskrouter.v1.workspaces(process.env.WORKSPACE_SID!).taskQueues.list(option);
};

export const fetchQueue = async (sid: string) => {
	const client = await createTwilioClient();
	return await client.taskrouter.v1.workspaces(process.env.WORKSPACE_SID!).taskQueues(sid).fetch();
};

export const listActivities = async (option: ActivityListInstanceOptions = {}) => {
	const client = await createTwilioClient();
	return await client.taskrouter.v1.workspaces(process.env.WORKSPACE_SID!).activities.list(option);
};

export const fetchActivity = async (sid: string) => {
	const client = await createTwilioClient();
	return await client.taskrouter.v1.workspaces(process.env.WORKSPACE_SID!).activities(sid).fetch();
};
