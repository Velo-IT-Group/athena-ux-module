'use server';
import { Twilio } from 'twilio';

const client = new Twilio(process.env.NEXT_PUBLIC_API_KEY_SID, process.env.NEXT_PUBLIC_API_KEY_SECRET, {
	accountSid: process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
});

export const getConferenceByName = async (friendlyName: string) => {
	try {
		const conferences = await client.conferences.list({ status: 'in-progress', friendlyName });

		if (conferences.length === 0) return;

		return conferences[0];
	} catch (error) {
		console.error(error);
		return;
	}
};

export const getConferenceParticipants = async (conferenceSid: string) => {
	try {
		const participants = await client.conferences(conferenceSid).participants.list();

		return participants;
	} catch (error) {
		console.error(error);
		return [];
	}
};
