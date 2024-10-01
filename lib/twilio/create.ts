'use server';
import { createClient } from '@/utils/twilio';

export const createWorker = async (friendlyName: string, attributes: Record<string, any>) => {
	const client = await createClient();

	console.log(friendlyName, attributes)

	try {
		const worker = await client.taskrouter.v1
			.workspaces(process.env.TWILIO_WORKSPACE_SID!)
			.workers.create({ friendlyName, attributes: JSON.stringify(attributes) })
		
			return worker
	} catch (error) {
		
	}
};