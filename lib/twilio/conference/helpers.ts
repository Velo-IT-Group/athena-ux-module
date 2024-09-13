'use server';
import { ConferenceContextUpdateOptions } from 'twilio/lib/rest/api/v2010/account/conference';
import { createClient } from '@/utils/twilio';
import { ParticipantInstance } from 'twilio/lib/rest/api/v2010/account/conference/participant';

export interface CreateParticipantParams {
	From: string;
	To: string;
	Label?: string;
	EarlyMedia?: boolean;
	Beep?: string;
	Muted?: boolean;
	StatusCallback?: string;
	StatusCallbackMethod?: string;
	StatusCallbackEvent?: string;
	Record?: boolean;
	Trim?: string;
	TimeLimit?: number;
	CallToken?: string;
	MachineDetection?: string;
	MachineDetectionTimeout?: number;
	MachineDetectionSpeechThreshold?: number;
	MachineDetectionSpeechEndThreshold?: number;
	MachineDetectionSilenceTimeout?: number;
	AmdStatusCallback?: string;
	AmdStatusCallbackMethod?: string;
	MachineDetectionEngine?: string;
	MachineDetectionMinWordLength?: number;
	MachineDetectionMaxWordLength?: number;
	MachineDetectionWordsSilence?: number;
	MachineDetectionMaxNumOfWords?: number;
	MachineDetectionSilenceThreshold?: number;
}

export const createConferenceParticipant = async (
	conferenceSid: string,
	params: CreateParticipantParams
): Promise<ParticipantInstance> => {
	let headers = new Headers();
	headers.set(
		'Authorization',
		`Basic ${btoa(process.env.TWILIO_API_KEY_SID + ':' + process.env.TWILIO_API_KEY_SECRET)}`
	);
	headers.set('Content-Type', 'application/x-www-form-urlencoded');
	const body = new URLSearchParams(params as unknown as Record<string, string>);
	console.log(body, params);

	const response = await fetch(
		`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Conferences/${conferenceSid}/Participants.json`,
		{
			headers,
			method: 'POST',
			body,
		}
	);

	if (!response.ok) {
		console.log(response);
	}

	return await response.json();
};

export const getConferenceByName = async (friendlyName: string) => {
	const client = await createClient();
	const conferences = await client.conferences.list({ friendlyName });

	if (conferences.length === 0) return;

	const conference = conferences[0];
	const participants = conference.participants();

	return {
		conference: {
			sid: conference.sid,
			participants: {
				...participants,
			},
		},
	};
};

export const getConferenceParticipants = async (conferenceSid: string) => {
	let headers = new Headers();
	headers.set(
		'Authorization',
		`Basic ${btoa(process.env.TWILIO_API_KEY_SID + ':' + process.env.TWILIO_API_KEY_SECRET)}`
	);
	const response = await fetch(
		`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Conferences/${conferenceSid}/Participants.json`,
		{
			headers,
		}
	);

	if (!response.ok) {
		console.log(response.statusText);
	}

	return await response.json();
};

export const getConferenceParticipant = async (
	conferenceSid: string,
	participantSid: string
): Promise<ParticipantInstance> => {
	let headers = new Headers();
	headers.set(
		'Authorization',
		`Basic ${btoa(process.env.TWILIO_API_KEY_SID + ':' + process.env.TWILIO_API_KEY_SECRET)}`
	);
	const response = await fetch(
		`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Conferences/${conferenceSid}/Participants/${participantSid}.json`,
		{
			headers,
		}
	);

	if (!response.ok) {
		console.log(response.statusText);
	}

	return await response.json();
};

export const updateConference = async (conferenceSid: string, params: ConferenceContextUpdateOptions) => {
	const client = await createClient();

	return await client.conferences(conferenceSid).update(params);
};

export const updateConferenceParticipants = async (
	conferenceSid: string,
	participant: string,
	params: Record<string, any>
) => {
	let headers = new Headers();
	headers.set(
		'Authorization',
		`Basic ${btoa(process.env.TWILIO_API_KEY_SID + ':' + process.env.TWILIO_API_KEY_SECRET)}`
	);
	headers.set('Content-Type', 'application/x-www-form-urlencoded');
	console.log(conferenceSid, participant);
	const response = await fetch(
		`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Conferences/${conferenceSid}/Participants/${participant}.json`,
		{
			headers,
			method: 'POST',
			body: new URLSearchParams(params),
		}
	);

	console.log(params);

	if (!response.ok) {
		console.log(response.statusText);
	}

	return await response.json();

	// return await client.conferences(conferenceSid).participants(participant).update(params);
};

export const removeConferenceParticipant = async (conferenceSid: string, participant: string) => {
	const client = await createClient();

	return await client.conferences(conferenceSid).participants(participant).remove();
};
