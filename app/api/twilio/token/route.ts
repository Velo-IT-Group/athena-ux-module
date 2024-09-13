'use server';
import { createAccessToken } from '@/lib/twilio';
import { cookies } from 'next/headers';
import { type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
	const { workerSid, email } = await request.json();

	const token = await createAccessToken(
		process.env.TWILIO_ACCOUNT_SID!,
		process.env.TWILIO_API_KEY_SID!,
		process.env.TWILIO_API_KEY_SECRET!,
		process.env.TWILIO_WORKSPACE_SID!,
		workerSid,
		email
	);

	console.log(token);

	return Response.json({ token });
}
