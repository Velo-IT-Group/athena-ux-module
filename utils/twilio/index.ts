'use server';
import { Twilio } from 'twilio';
import { SyncClient } from 'twilio-sync';
import { cookies } from 'next/headers';

export const createClient = async () =>
	await new Twilio(process.env.TWILIO_API_KEY_SID, process.env.TWILIO_API_KEY_SECRET, {
		accountSid: process.env.TWILIO_ACCOUNT_SID,
	});

export const createSyncClient = async () => {
	const token = cookies().get('twilio_token')?.value;
	console.log('TOKEN', token);
	if (!token) throw new Error('No token found');

	return await new SyncClient(token);
};
