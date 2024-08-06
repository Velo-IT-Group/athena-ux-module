import { NextResponse } from 'next/server';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';
import { ConferenceAttributes } from 'twilio/lib/twiml/VoiceResponse';

export async function POST(request: Request) {
	const data = await request.formData();
	const twiml = new VoiceResponse();

	console.log(data);

	const dial = twiml.dial({ callerId: data.get('Caller') as string });
	dial.client('nblack@velomethod.com');
	dial.conference(
		{
			beep: false,
			startConferenceOnEnter: true,
			endConferenceOnExit: true,
		},
		'NoMusicNoBeepRoom'
	);
	// console.log(dial);
	// console.log(data, twiml);

	// response.

	// response.type = 'application/json';
	// response.send({
	//   instruction: "dequeue",
	//   post_work_activity_sid: app.get('workspaceInfo').activities.idle
	// });
	let response = new NextResponse(twiml.toString());
	response.headers.set('Content-Type', 'text/xml');

	return response;
	// return Response.json({
	// 	instruction: "dequeue",
	// 	to: "469-344-2265",
	// 	"from": "{the caller ID that you want to send to the Worker. Required.}",
	// 	"post_work_activity_sid": "{the ActivitySid that should be assigned to the Worker after the call ends. Optional.}
	// })

	// return response.
}
