'use server';
import { getTicket } from '@/lib/manage/read';
import { createClient, createReportingClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { Twilio } from 'twilio';
import { WorkerInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/worker';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';

const client = new Twilio(process.env.NEXT_PUBLIC_TWILIO_API_KEY_SID, process.env.NEXT_PUBLIC_TWILIO_API_KEY_SECRET, {
	accountSid: process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
});

type ActivityEvent = 'activity.created' | 'activity.updated' | 'activity.deleted';
type ReservationEvent =
	| 'reservation.created'
	| 'reservation.accepted'
	| 'reservation.rejected'
	| 'reservation.timeout'
	| 'reservation.canceled'
	| 'reservation.rescinded'
	| 'reservation.completed'
	| 'reservation.failed'
	| 'reservation.wrapup';

type TaskEvent =
	| 'task.created'
	| 'task.updated'
	| 'task.canceled'
	| 'task.completed'
	| 'task.transfer-failed'
	| 'task.deleted'
	| 'task.system-deleted'
	| 'task.transfer-initiated'
	| 'task.transfer-attempt-failed'
	| 'task.transfer-canceled'
	| 'task.transfer-completed'
	| 'task.wrapup';

type TaskQueueEvent =
	| 'task-queue.created'
	| 'task-queue.entered'
	| 'task-queue.deleted'
	| 'task-queue.timeout'
	| 'task-queue.moved'
	| 'task-queue.expression.updated';

type EventType = ActivityEvent | ReservationEvent | TaskEvent | TaskQueueEvent;

export async function POST(request: Request) {
	revalidatePath('/');
	const supabase = createReportingClient()
	const data = await request.formData();
	const object = Object.fromEntries(data);
	console.log(object)
	const {error} = await supabase.from('json_data').insert({
		json_data: object
	})

	console.error(error)
	const eventType = data.get('EventType') as EventType;
	const workflowName = data.get('WorkflowName') as string;
	const taskSid = data.get('TaskSid') as string;
	const TaskAttributes = data.get('TaskAttributes') as string;
	const TaskQueueName = data.get('TaskQueueName') as string;
	const twiml = new VoiceResponse();

	if (eventType === 'task-queue.entered' && workflowName === 'Voicemail') {
		try {
			let taskAttributes = JSON.parse(TaskAttributes);

			const ticket = await getTicket(taskAttributes.ticketId, { fields: ['id', 'summary', 'board', 'status'] });

			console.log(ticket);

			// check if ticket is off of triage board or the status isn't new
			if (ticket.board?.id !== 30 || ticket.status?.id !== 530) {
				const task = await client.taskrouter.v1.workspaces(process.env.WORKSPACE_SID!).tasks(taskSid).remove();

				return Response.json(task, { status: 200 });
			}

			let targetWorkersExpression = '';

			// create proper targetWorkerExpression
			switch (TaskQueueName) {
				case 'On Call Engineers':
					targetWorkersExpression = `on_call == true`;
					// if (formattedTeam) {
					// 	// targetWorkersExpression = `on_call == true AND roles HAS '${formattedTeam}'`;
					// } else {

					// }
					break;
				case 'Escalations Engineers':
					targetWorkersExpression = `job_title CONTAINS 'Escalations'`;

					break;
				case 'Strength Engineers':
					targetWorkersExpression = `job_title CONTAINS 'Strength'`;
					break;
				case 'Executive Team':
					targetWorkersExpression = `job_title CONTAINS 'Director' OR job_title CONTAINS 'President'`;
					break;

				default:
					return Response.json({ status: 200 });
			}

			const workers = await client.taskrouter.v1
				.workspaces(process.env.WORKSPACE_SID!)
				.workers.list({ targetWorkersExpression: targetWorkersExpression, limit: 20 });

			if (!workers.length) {
				throw new Error(`No workers found with the following expression: ${targetWorkersExpression}`);
			}

			let worker: WorkerInstance | undefined = workers[0];

			if (TaskQueueName === 'Executive Team') {
				worker = workers.find(({ attributes }) => JSON.parse(attributes).job_title.includes('President'));
			}

			const { direct_dial, work_phone } = JSON.parse(worker?.attributes || '{}');
			const url = `https://handler.twilio.com/twiml/EH0ec07397c5e0fb477e4c535af5a1e245?recording_url=${taskAttributes.recordingUrl}`;

			const notification = await client.calls.create({ to: direct_dial ?? work_phone, from: '+12142148356', url });

			if (TaskQueueName === 'Executive Team') {
				taskAttributes = { ...taskAttributes, called_doo: true };

				await client.taskrouter.v1
					.workspaces(process.env.WORKSPACE_SID!)
					.tasks(taskSid)
					.update({
						attributes: JSON.stringify(taskAttributes),
					});
			}

			return Response.json(notification, { status: 200 });
		} catch (error) {
			return Response.json(error, { status: 400 });
		}
	}

	if (eventType === 'task-queue.entered' && TaskQueueName === 'Microsoft Teams Queue') {
		const ta = JSON.parse(TaskAttributes);
		const callSid = ta.call_sid;
		let url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/test`;
		try {
			await client.calls(callSid).update({ method: 'POST', url: encodeURI(url) });
			return Response.json({ status: 200 });
		} catch (error) {
			console.error(error);
			return Response.json(error, { status: 500 });
		}
	}

	return Response.json(
		{
			message: 'Revalidation successful',
		},
		{ status: 200 }
	);
}
