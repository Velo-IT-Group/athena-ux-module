'use server';
import { createClient } from '@/utils/twilio';

export const getConferenceParticipants = async (conferenceSid: string) => {
	const client = await createClient();
	return await client.conferences(conferenceSid).participants.list({ muted: false });
};
