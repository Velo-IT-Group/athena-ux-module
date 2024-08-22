'use server';
import { jwt } from 'twilio';
import { VoiceGrant } from 'twilio/lib/jwt/AccessToken';
const AccessToken = jwt.AccessToken;
const TaskRouterGrant = AccessToken.TaskRouterGrant;

export const createAccessToken = async (
	accountSid: string,
	signingKeySid: string,
	signingKeySecret: string,
	workspaceSid: string,
	workerSid: string,
	identity: string
) => {
	console.log(accountSid, signingKeySid, signingKeySecret, workspaceSid, workerSid, identity);
	const taskRouterGrant = new TaskRouterGrant({
		workerSid,
		workspaceSid,
		role: 'worker',
	});

	const voiceGrant = new VoiceGrant({
		outgoingApplicationSid: process.env.TWILIO_APPLICATION_SID,
		incomingAllow: true, // Optional: add to allow incoming calls
	});

	const accessToken = new AccessToken(accountSid, signingKeySid, signingKeySecret, {
		identity,
	});

	accessToken.addGrant(taskRouterGrant);
	accessToken.addGrant(voiceGrant);

	// (accessToken.toJwt() as unknown as Promise<string>).then((t:string) => {token = t})

	return accessToken.toJwt();
};
