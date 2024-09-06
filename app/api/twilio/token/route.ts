'use server';
import { createAccessToken } from '@/lib/twilio';
import { cookies } from 'next/headers';
import { type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
	const cookieStore = cookies();
	const { workerSid, email } = await request.json();

	const token = await createAccessToken(
		process.env.TWILIO_ACCOUNT_SID!,
		process.env.TWILIO_API_KEY_SID!,
		process.env.TWILIO_API_KEY_SECRET!,
		process.env.TWILIO_WORKSPACE_SID!,
		workerSid,
		email
	);

	const hasCookie = cookieStore.has('twilio_token');
	if (!hasCookie) {
		cookieStore.set('twilio_token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 30,
			path: '/',
		});
	}

	return Response.json({ token });
}
