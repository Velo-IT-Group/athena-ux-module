'use server';
import { ConferenceContextUpdateOptions } from 'twilio/lib/rest/api/v2010/account/conference';
import { ParticipantContextUpdateOptions } from 'twilio/lib/rest/api/v2010/account/conference/participant';
import { createClient } from '@/utils/twilio';

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
	const client = await createClient();
	return await client.conferences(conferenceSid).participants.list();
};

export const updateConference = async (conferenceSid: string, params: ConferenceContextUpdateOptions) => {
	const client = await createClient();

	return await client.conferences(conferenceSid).update(params);
};

export const updateConferenceParticipants = async (
	conferenceSid: string,
	participant: string,
	params: ParticipantContextUpdateOptions
) => {
	const client = await createClient();

	return await client.conferences(conferenceSid).participants(participant).update(params);
};

export const removeConferenceParticipant = async (conferenceSid: string, participant: string) => {
	const client = await createClient();

	return await client.conferences(conferenceSid).participants(participant).remove();
};
