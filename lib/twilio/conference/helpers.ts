'use server';
import { Twilio } from 'twilio';

const client = new Twilio(process.env.NEXT_PUBLIC_API_KEY_SID, process.env.NEXT_PUBLIC_API_KEY_SECRET, {
	accountSid: process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
});

export const getConferenceByName = async (friendlyName: string) => {
	console.log(friendlyName);

	const conferences = await client.conferences.list({ friendlyName });

	console.log(conferences);

	if (conferences.length === 0) return;

	const conference = conferences[0];

	delete conference['_context'];
	// @ts-ignore
	delete conference['_proxy'];
	// @ts-ignore
	delete conference['_solution'];
	// @ts-ignore
	delete conference['_version'];
	// @ts-ignore
	delete conference['toJSON'];
	// @ts-ignore
	delete conference['update'];

	return conference;
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
