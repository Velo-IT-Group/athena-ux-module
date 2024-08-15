import { revalidatePath } from 'next/cache';

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

type EventType = ActivityEvent | ReservationEvent | TaskEvent;

export async function POST(request: Request) {
	revalidatePath('/');
	const data = await request.formData();
	const eventType = data.get('EventType') as EventType;

	return Response.json(
		{
			message: 'Revalidation successful',
		},
		{ status: 200 }
	);
}
