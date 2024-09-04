'use server';
import { jwt } from 'twilio';
const AccessToken = jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const TaskRouterGrant = AccessToken.TaskRouterGrant;
const SyncGrant = AccessToken.SyncGrant;

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

	const syncGrant = new SyncGrant({
		serviceSid: process.env.TWILIO_SYNC_SID,
	});

	const accessToken = new AccessToken(accountSid, signingKeySid, signingKeySecret, {
		identity,
	});

	accessToken.addGrant(taskRouterGrant);
	accessToken.addGrant(voiceGrant);
	accessToken.addGrant(syncGrant);

	return accessToken.toJwt();
};
