'use server';
import { Twilio } from 'twilio';

const client = new Twilio(process.env.NEXT_PUBLIC_API_KEY_SID, process.env.NEXT_PUBLIC_API_KEY_SECRET, {
	accountSid: process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
});

export const getPhoneNumbers = async () => {
	const phoneNumbers = await client.incomingPhoneNumbers.list({
		limit: 25,
	});

	return phoneNumbers.map((number) => {
		delete number['_context'];
		// @ts-ignore
		delete number['_proxy'];
		// @ts-ignore
		delete number['_solution'];
		// @ts-ignore
		delete number['_version'];
		return number;
	});
};
