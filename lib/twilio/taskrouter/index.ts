'use server';
import { Twilio } from 'twilio';
import { WorkspaceContext } from 'twilio/lib/rest/taskrouter/v1/workspace';
var ACCOUNT_SID = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
var AUTH_TOKEN = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;

export const createClient = (existingWorkspaceSid?: string): WorkspaceContext => {
	const twilio = new Twilio(ACCOUNT_SID, AUTH_TOKEN);
	const workspace = twilio.taskrouter.v1.workspaces(process.env.NEXT_PUBLIC_WORKSPACE_SID!);

	return workspace;
};
