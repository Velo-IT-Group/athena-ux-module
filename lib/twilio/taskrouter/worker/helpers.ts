'use server';
import { createClient } from '@/utils/twilio';

export const getActivies = async () => {
	const client = createClient();
	return await client.taskrouter.v1.workspaces(process.env.WORKSPACE_SID!).activities.list();
};
