'use server';
import { Twilio } from 'twilio';

export const createClient = () =>
	new Twilio(process.env.TWILIO_API_KEY_SID, process.env.TWILIO_API_KEY_SECRET, {
		accountSid: process.env.TWILIO_ACCOUNT_SID,
	});
