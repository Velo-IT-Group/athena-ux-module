'use server';
import { Twilio } from 'twilio';

const client = new Twilio(process.env.NEXT_PUBLIC_API_KEY_SID, process.env.NEXT_PUBLIC_API_KEY_SECRET, {
	accountSid: process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
});

export const getActivies = async () => {
	return (await client.taskrouter.v1.workspaces(process.env.NEXT_PUBLIC_WORKSPACE_SID!).activities.list()).map(
		(activity) => {
			delete activity['_context'];
			// @ts-ignore
			delete activity['_proxy'];
			// @ts-ignore
			delete activity['_solution'];
			// @ts-ignore
			delete activity['_version'];
			// @ts-ignore
			delete activity['toJSON'];
			// @ts-ignore

			return activity;
		}
	);
};
