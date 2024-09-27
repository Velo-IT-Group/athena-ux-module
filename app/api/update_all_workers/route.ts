'use server';
import { getWorkers } from '@/lib/twilio/read';
import { updateWorker } from '@/lib/twilio/update';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
	if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
		return NextResponse.json({message: 'UNAUTHORIZED', status: 400})
	}
	const workers = await getWorkers({ available: 'true' })
	
	await Promise.all(workers.map(worker => updateWorker(worker.sid, {activitySid: process.env.TWILIO_DEFAULT_ACTIVITY_SID!})))

  return NextResponse.json({ ok: true });
}
