'use server';
import { createClient } from '@/utils/twilio';

export const deleteWorker = async (id: string) => {
	const client = createClient();
	try {
		return await client.taskrouter.v1.workspaces(process.env.NEXT_PUBLIC_WORKSPACE_SID!).workers(id).remove();
	} catch (error) {
		console.error(error);
		return false;
	}
};
