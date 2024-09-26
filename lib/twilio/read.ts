'use server';
import { createClient } from '@/utils/twilio';
import { twiml } from 'twilio';
import { WorkerInstance, WorkerListInstanceOptions } from 'twilio/lib/rest/taskrouter/v1/workspace/worker';
import { CountryInstance } from 'twilio/lib/rest/voice/v1/dialingPermissions/country';

export const getWorkers = async (options: WorkerListInstanceOptions = {}): Promise<WorkerInstance[]> => {
	const client = await createClient();
	try {
		return await client.taskrouter.v1.workspaces(process.env.TWILIO_WORKSPACE_SID!).workers.list(options);
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const call = async (CallSid: string, callerId: string, phone: string) => {
	let name = 'conf_' + CallSid;

	const response = new twiml.VoiceResponse();
	const dial = response.dial({ callerId });

	dial.conference(
		{
			endConferenceOnExit: false,
			statusCallbackEvent: ['join'],
			statusCallback: `/api/phone/call/${CallSid}/add-participant/${encodeURIComponent(phone)}`,
		},
		name
	);
};

export const addParticipant = async (sid: string, CallSid: string, phone: string, callerId: string) => {
	const client = await createClient();
	if (CallSid === sid) {
		/* the agent joined, we now call the phone number and add it to the conference */
		const participant = await client.conferences('conf_' + sid).participants.create({
			to: phone,
			from: callerId,
			earlyMedia: true,
			endConferenceOnExit: false,
		});

		return participant;
	} else {
	}
};

export const hold = async (conferenceSid: string, callSid: string, hold: boolean) => {
	const client = await createClient();
	return await client.conferences(conferenceSid).participants(callSid).update({ hold });
};

export const getInboundCalls = async (to?: string, startTime?: Date, endTime?: Date, limit: number = 25) => {
	const client = await createClient();
	return await client.calls.list({ to, startTime, endTime, limit });
};

export const getOutboundCalls = async (from?: string, limit: number = 25) => {
	const client = await createClient();
	return await client.calls.list({ from, limit });
};

export const getAllCalls = async (identity?: string, limit: number = 25) => {
	const [inbound, outbound] = await Promise.all([getInboundCalls(identity), getOutboundCalls(identity)]);

	return [...inbound, ...outbound];
};

export const getDialingPermissions = async (identity?: string, limit: number = 25): Promise<CountryInstance[]> => {
	const client = await createClient()

	const data = await client.voice.v1.dialingPermissions.countries.list({
		lowRiskNumbersEnabled: true,
		limit: 1000
		// highRiskSpecialNumbersEnabled: true,
		// highRiskTollfraudNumbersEnabled: true
	});

	return JSON.parse(JSON.stringify(data));
};
