import { createClient } from '@/lib/twilio';
import { twiml } from 'twilio';
import { createClient as tasRouterClient } from '@/lib/twilio/taskrouter';
import { formatPhoneNumber } from 'react-phone-number-input';
const VoiceResponse = twiml.VoiceResponse;

export const createCall = async (from: string, to: string) => {
	const response = new VoiceResponse();
	response.enqueue({
		workflowSid: '',
	});

	const client = createClient();
	const taskrouter = tasRouterClient();
	const phoneNumber = formatPhoneNumber(to);

	taskrouter.tasks.create();
	const call = await client.calls.create({
		from: '+15017122661',
		to: '+14155551212',
		twiml: '<Response><Say>Ahoy, World!</Say></Response>',
	});
};
