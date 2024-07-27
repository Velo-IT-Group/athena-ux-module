'use server';
import { Twilio, twiml } from 'twilio';
import { WorkerInstance, WorkerListInstanceOptions } from 'twilio/lib/rest/taskrouter/v1/workspace/worker';
import { getConferenceByName, getConferenceParticipants } from './conference/helpers';

const client = new Twilio(process.env.NEXT_PUBLIC_TWILIO_API_KEY_SID, process.env.NEXT_PUBLIC_TWILIO_API_KEY_SECRET, {
	accountSid: process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
});

export const getWorkers = async (
	options: WorkerListInstanceOptions = { available: 'true' }
): Promise<WorkerInstance[]> => {
	try {
		const workers = await client.taskrouter.v1.workspaces(process.env.NEXT_PUBLIC_WORKSPACE_SID!).workers.list(options);

		return workers.map((worker) => {
			delete worker['_context'];
			// @ts-ignore
			delete worker['_proxy'];
			// @ts-ignore
			delete worker['_solution'];
			// @ts-ignore
			delete worker['_version'];
			// @ts-ignore
			delete worker['toJSON'];
			// @ts-ignore
			delete worker['update'];
			// @ts-ignore
			delete worker['userDefinedMessages'];
			// @ts-ignore
			delete worker['userDefinedMessageSubscriptions'];
			// @ts-ignore
			delete worker['events'];
			// @ts-ignore
			delete worker['fetch'];
			// @ts-ignore
			delete worker['notifications'];
			// @ts-ignore
			delete worker['payments'];
			// @ts-ignore
			delete worker['recordings'];
			// @ts-ignore
			delete worker['remove'];
			// @ts-ignore
			delete worker['siprec'];
			// @ts-ignore
			delete worker['streams'];
			// @ts-ignore
			delete worker['transcriptions'];
			return worker;
		});
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const getConference = async (sid: string, callSid: string) => {
	const conference = await getConferenceByName('conf_' + sid);

	if (!conference) return;

	const participants = await getConferenceParticipants(conference.sid);

	const list = participants.filter((participant) => {
		if (callSid !== participant.callSid) {
			return participant;
		}
	});

	if (list.length !== 0) {
		callSid = list[0].callSid;
	}

	return {
		conferenceSid: conference.sid,
		callSid,
	};
};

export const call = async (CallSid: string, callerId: string, phone: string) => {
	let name = 'conf_' + CallSid;

	const response = new twiml.VoiceResponse();
	const dial = response.dial({ callerId });

	dial.conference(
		{
			endConferenceOnExit: true,
			statusCallbackEvent: ['join'],
			statusCallback: `/api/phone/call/${CallSid}/add-participant/${encodeURIComponent(phone)}`,
		},
		name
	);
};

export const addParticipant = async (sid: string, CallSid: string, phone: string, callerId: string) => {
	if (CallSid === sid) {
		/* the agent joined, we now call the phone number and add it to the conference */
		const participant = await client.conferences('conf_' + sid).participants.create({
			to: phone,
			from: callerId,
			earlyMedia: true,
			endConferenceOnExit: true,
		});

		return participant;
	} else {
	}
};

export const hold = async (conferenceSid: string, callSid: string, hold: boolean) => {
	return await client.conferences(conferenceSid).participants(callSid).update({ hold });
};

export const getInboundCalls = async (to?: string, startTime?: Date, endTime?: Date, limit: number = 25) => {
	return (await client.calls.list({ to, startTime, endTime, limit })).map((c) => {
		const call = c;
		delete call['_context'];
		// @ts-ignore
		delete call['_proxy'];
		// @ts-ignore
		delete call['_solution'];
		// @ts-ignore
		delete call['_version'];
		// @ts-ignore
		delete call['toJSON'];
		// @ts-ignore
		delete call['update'];
		// @ts-ignore
		delete call['userDefinedMessages'];
		// @ts-ignore
		delete call['userDefinedMessageSubscriptions'];
		// @ts-ignore
		delete call['events'];
		// @ts-ignore
		delete call['fetch'];
		// @ts-ignore
		delete call['notifications'];
		// @ts-ignore
		delete call['payments'];
		// @ts-ignore
		delete call['recordings'];
		// @ts-ignore
		delete call['remove'];
		// @ts-ignore
		delete call['siprec'];
		// @ts-ignore
		delete call['streams'];
		// @ts-ignore
		delete call['transcriptions'];
		return call;
	});
};

export const getOutboundCalls = async (from?: string, limit: number = 25) => {
	return (await client.calls.list({ from, limit })).map((c) => {
		const call = c;
		delete call['_context'];
		// @ts-ignore
		delete call['_proxy'];
		// @ts-ignore
		delete call['_solution'];
		// @ts-ignore
		delete call['_version'];
		// @ts-ignore
		delete call['toJSON'];
		// @ts-ignore
		delete call['update'];
		// @ts-ignore
		delete call['userDefinedMessages'];
		// @ts-ignore
		delete call['userDefinedMessageSubscriptions'];
		// @ts-ignore
		delete call['events'];
		// @ts-ignore
		delete call['fetch'];
		// @ts-ignore
		delete call['notifications'];
		// @ts-ignore
		delete call['payments'];
		// @ts-ignore
		delete call['recordings'];
		// @ts-ignore
		delete call['remove'];
		// @ts-ignore
		delete call['siprec'];
		// @ts-ignore
		delete call['streams'];
		// @ts-ignore
		delete call['transcriptions'];
		return call;
	});
};

export const getAllCalls = async (identity?: string, limit: number = 25) => {
	const [inbound, outbound] = await Promise.all([getInboundCalls(identity), getOutboundCalls(identity)]);

	return [...inbound, ...outbound].map((c) => {
		const call = c;
		delete call['_context'];
		// @ts-ignore
		delete call['_proxy'];
		// @ts-ignore
		delete call['_solution'];
		// @ts-ignore
		delete call['_version'];
		// @ts-ignore
		delete call['toJSON'];
		// @ts-ignore
		delete call['update'];
		// @ts-ignore
		delete call['userDefinedMessages'];
		// @ts-ignore
		delete call['userDefinedMessageSubscriptions'];
		// @ts-ignore
		delete call['events'];
		// @ts-ignore
		delete call['fetch'];
		// @ts-ignore
		delete call['notifications'];
		// @ts-ignore
		delete call['payments'];
		// @ts-ignore
		delete call['recordings'];
		// @ts-ignore
		delete call['remove'];
		// @ts-ignore
		delete call['siprec'];
		// @ts-ignore
		delete call['streams'];
		// @ts-ignore
		delete call['transcriptions'];
		return call;
	});
};
