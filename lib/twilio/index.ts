'use server';
import { Twilio, jwt } from 'twilio';
import { VoiceGrant } from 'twilio/lib/jwt/AccessToken';
const AccessToken = jwt.AccessToken;
const TaskRouterGrant = AccessToken.TaskRouterGrant;
import { WorkspaceContext } from 'twilio/lib/rest/taskrouter/v1/workspace';

var ACCOUNT_SID = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
var AUTH_TOKEN = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;

export const createClient = (existingWorkspaceSid?: string): Twilio => {
	const twilio = new Twilio(ACCOUNT_SID, AUTH_TOKEN);
	return twilio;
};

export const createAccessToken = async (
	accountSid: string,
	signingKeySid: string,
	signingKeySecret: string,
	workspaceSid: string,
	workerSid: string,
	identity: string
) => {
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
