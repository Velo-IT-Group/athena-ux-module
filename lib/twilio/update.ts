'use server';
import { Twilio } from 'twilio';
import { ReservationContextUpdateOptions } from 'twilio/lib/rest/taskrouter/v1/workspace/task/reservation';
import { WorkerContextUpdateOptions } from 'twilio/lib/rest/taskrouter/v1/workspace/worker';

const client = new Twilio(process.env.NEXT_PUBLIC_TWILIO_API_KEY_SID, process.env.NEXT_PUBLIC_TWILIO_API_KEY_SECRET, {
	accountSid: process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
});

export const updateWorker = async (workerSid: string, options: WorkerContextUpdateOptions) => {
	try {
		const worker = await client.taskrouter.v1
			.workspaces(process.env.NEXT_PUBLIC_WORKSPACE_SID!)
			.workers(workerSid)
			.update(options);

		console.log(worker);
	} catch (error) {
		console.error(error);
	}
};

export const resToConference = async (
	taskSid: string,
	reservationSid: string,
	params: ReservationContextUpdateOptions = {
		instruction: 'conference',
	}
) => {
	const reservation = await client.taskrouter.v1
		.workspaces(process.env.NEXT_PUBLIC_WORKSPACE_SID!)
		.tasks(taskSid)
		.reservations(reservationSid)
		.update(params);

	console.log(reservation);
};
