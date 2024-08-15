'use server';
import { Twilio } from 'twilio';
import { ConferenceContextUpdateOptions } from 'twilio/lib/rest/api/v2010/account/conference';
import { ParticipantContextUpdateOptions } from 'twilio/lib/rest/api/v2010/account/conference/participant';

const client = new Twilio(process.env.NEXT_PUBLIC_TWILIO_API_KEY_SID, process.env.NEXT_PUBLIC_TWILIO_API_KEY_SECRET, {
	accountSid: process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
});

export const getConferenceByName = async (friendlyName: string) => {
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
	const participants = await client.conferences(conferenceSid).participants.list();
	const conference = await client.conferences(conferenceSid).fetch();
	console.log('participants', conference.participants());
	return conference.participants();
};

export const updateConference = async (conferenceSid: string, params: ConferenceContextUpdateOptions) => {
	const conference = await client.conferences(conferenceSid).update(params);

	return conference;
};

export const updateConferenceParticipants = async (
	conferenceSid: string,
	participant: string,
	params: ParticipantContextUpdateOptions
) => {
	const conference = await client.conferences(conferenceSid).participants(participant).update(params);

	return conference;
};
