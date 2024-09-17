'use server';
import { createClient } from '@/utils/twilio';

export const getActivities = async () => {
	const client = await createClient();
	return await client.taskrouter.v1.workspaces(process.env.TWILIO_WORKSPACE_SID!).activities.list();
};
