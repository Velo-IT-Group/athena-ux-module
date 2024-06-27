import { WorkerContextUpdateOptions } from 'twilio/lib/rest/taskrouter/v1/workspace/worker';

export const updateWorker = async (workerSid: string, options: WorkerContextUpdateOptions) => {
	const headers = new Headers();
	headers.append(
		'Authorization',
		`Basic ${btoa(`${process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID}:${process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN}`)}`
	);

	try {
		const response = await fetch(
			`https://taskrouter.twilio.com/v1/Workspaces/${process.env.NEXT_PUBLIC_WORKSPACE_SID}/Workers/${workerSid}`,
			{
				method: 'POST',
				headers,
				body: JSON.stringify(options),
			}
		);

		if (!response.ok) throw new Error(response.statusText);

		console.log(response.status);
	} catch (error) {
		console.error(error);
	}
};
