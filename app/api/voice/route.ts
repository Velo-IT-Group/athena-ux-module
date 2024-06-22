import { NextResponse } from 'next/server';
const VoiceResponse = require('twilio').twiml.VoiceResponse;

export async function POST(request: Request) {
	const data = await request.formData();
	const twiml = new VoiceResponse();

	const dial = twiml.dial({ callerId: data.get('Caller') as string });
	console.log(dial);
	dial.number('469-344-2265');
	console.log(data, twiml);

	// response.

	// response.type = 'application/json';
	// response.send({
	//   instruction: "dequeue",
	//   post_work_activity_sid: app.get('workspaceInfo').activities.idle
	// });
	return NextResponse.json(twiml.toString());
	// return Response.json({
	// 	instruction: "dequeue",
	// 	to: "469-344-2265",
	// 	"from": "{the caller ID that you want to send to the Worker. Required.}",
	// 	"post_work_activity_sid": "{the ActivitySid that should be assigned to the Worker after the call ends. Optional.}
	// })

	// return response.
}
