'use client';
import { Twilio } from 'twilio';

export function createClient() {
	return new Twilio(process.env.NEXT_PUBLIC_TWILIO_API_KEY_SID, process.env.NEXT_PUBLIC_TWILIO_API_KEY_SECRET, {
		accountSid: process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
	});
}
