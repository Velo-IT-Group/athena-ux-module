import { isAValidPhoneNumber } from '@/lib/utils';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';

export async function POST(request: Request) {
	const supabase = await createClient();
	const twiml = new VoiceResponse();
	const [
		{
			data: { user },
		},

		data,
	] = await Promise.all([supabase.auth.getUser(), request.formData()]);
	const toNumberOrClientName = data.get('To') as string;
	const To = data.get('To') as string;
	const callerId = '+18449402678';

	if (toNumberOrClientName == callerId) {
		let dial = twiml.dial({ callerId: data.get('Caller') as string, answerOnBridge: true });

		// This will connect the caller with your Twilio.Device/client
		dial.client(user?.email ?? '');
	} else if (To) {
		// This is an outgoing call

		// set the callerId
		let dial = twiml.dial({ callerId, answerOnBridge: true });

		// Check if the 'To' parameter is a Phone Number or Client Name
		// in order to use the appropriate TwiML noun
		const attr = isAValidPhoneNumber(toNumberOrClientName) ? 'number' : 'client';
		dial[attr]({}, toNumberOrClientName);
	} else {
		twiml.say('Thanks for calling!');
	}

	let response = new NextResponse(twiml.toString());
	response.headers.set('Content-Type', 'text/xml');

	return response;
}
