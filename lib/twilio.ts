'use server';
import Twilio from 'twilio';
const AccessToken = Twilio.jwt.AccessToken;
const TaskRouterGrant = AccessToken.TaskRouterGrant;

export const createAccessToken = async (
	accountSid: string,
	signingKeySid: string,
	signingKeySecret: string,
	workspaceSid: string,
	workerSid: string,
	identity: string = 'nblack_40velomethod_2Ecom'
) => {
	const taskRouterGrant = new TaskRouterGrant({
		workerSid,
		workspaceSid,
		role: 'worker',
	});

	const accessToken = new AccessToken(accountSid, signingKeySid, signingKeySecret, {
		identity,
	});

	accessToken.addGrant(taskRouterGrant);

	// (accessToken.toJwt() as unknown as Promise<string>).then((t:string) => {token = t})

	return accessToken.toJwt();
};
