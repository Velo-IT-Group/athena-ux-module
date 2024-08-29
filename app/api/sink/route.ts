'use server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type NextRequest } from 'next/server';

type TaskRouterEvent =
	| 'com.twilio.taskrouter.task.created'
	| 'com.twilio.taskrouter.task.canceled'
	| 'com.twilio.taskrouter.task.updated';
type VoiceEvent = 'com.twilio.voice.twiml.call.requested';

type EventType = TaskRouterEvent | VoiceEvent;

type VoiceParameters = {
	Called: string;
	MaxQueueSize?: string;
	ToState: string;
	CallerCountry: string;
	Direction: string;
	CallerState: string;
	ToZip: string;
	QueueTime?: string;
	CallSid: string;
	To: string;
	CallerZip: string;
	ToCountry: string;
	CalledZip: string;
	ApiVersion: string;
	QueuePosition?: string;
	CalledCity: string;
	CallStatus: string;
	From: string;
	QueueSid?: string;
	AccountSid: string;
	CurrentQueueSize?: string;
	CalledCountry: string;
	CallerCity: string;
	ToCity: string;
	FromCountry: string;
	Caller: string;
	FromCity: string;
	AvgQueueTime?: string;
	CalledState: string;
	FromZip: string;
	FromState: string;
	CallToken?: string;
	AddOns?: string;
	Timestamp?: string;
	CallbackSource?: string;
	SequenceNumber?: string;
	Duration?: string;
	CallDuration?: string;
	QueueResult?: string;
};

export async function POST(request: NextRequest) {
	const cookieStore = cookies();
	const supabase = createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			db: {
				schema: 'reporting',
			},
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
					} catch {
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
		}
	);
	const response = await request.json();

	response.forEach(({ type, data }: { type: EventType; data: any }) => {
		switch (true) {
			case type.includes('taskrouter'):
				const { payload } = data;
				const attributes = JSON.parse(payload.attributes);
				const isAbandoned =
					attributes.conversations.abandoned ||
					(payload.task_assignment_status === 'canceled' && payload.task_canceled_reason === 'hangup');

				supabase.from('conversations').upsert({
					abandoned: isAbandoned ? 'Yes' : 'No',
					abandon_time: isAbandoned ? payload.task_age : null,
					abandoned_phase: attributes.conversations.abandoned_phase || payload.task_queue_name,
					activity: attributes.conversations.activity,
					activity_time: attributes.conversations.activity_time,
					average_response_time: attributes.conversations.average_response_time || null,
					call_sid: attributes.call_sid,
					campaign: attributes.conversations.campaign || null,
					case: attributes.conversations.case || null,
					channel: attributes.channelType || null,
					communication_channel: attributes.conversations.communication_channel || null,
					content: attributes.conversations.content || null,
					conversation_id: payload.task_sid,
					date: new Date(payload.date_created).toISOString(),
					destination: attributes.To,
					direction: attributes.direction,
					external_contact: attributes.userId,
					first_response_time: attributes.conversations.first_response_time || null,
					focus_time: attributes.conversations.focus_time || null,
					followed_by: attributes.conversations.followed_by || null,
					handling_department: attributes.conversations.handling_department || null,
					handling_team: attributes.conversations.handling_team || null,
					hang_up_by: attributes.conversations.hang_up_by || null,
					hold_time: attributes.conversations.hold_time || null,
					id: payload.task_sid,
					in_business_hours: attributes.conversations.in_business_hours || null,
					initiated_by: attributes.conversations.initiated_by || null,
					initiative: attributes.conversations.initiative || null,
					ivr_path: attributes.conversations.ivr_path || null,
					ivr_time: attributes.conversations.ivr_time || null,
					language: attributes.conversations.language || null,
					order: attributes.conversations.order || null,
					outcome: attributes.conversations.outcome || null,
					preceded_by: attributes.conversations.preceded_by || null,
					productive: attributes.conversations.productive || null,
					queue: payload.task_queue_name,
					queue_time: payload.task_queue_time,
					ring_time: attributes.conversations.ring_time || null,
					segment: attributes.conversations.segment || null,
					segment_link: attributes.conversations.segment_link,
					service_level: attributes.conversations.service_level || null,
					source: attributes.conversations.source || null,
					talk_time: attributes.conversations.talk_time || null,
					time: payload.date_created,
					virtual: attributes.conversations.virtual || null,
					workflow: payload.workflow_name,
					wrap_up_time: attributes.conversations.wrap_up_time || null,
				});
				console.log('TASKROUTER', payload);
				break;
			case type.includes('voice'):
				const { parameters }: { parameters: VoiceParameters } = data.request;

				console.log('VOICE', JSON.stringify(parameters));
				break;
		}
	});

	return Response.json({ status: 200 });
}
