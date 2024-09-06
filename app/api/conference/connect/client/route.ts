'use server';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const conferenceSid = searchParams.get('conferenceSid');
	const clientName = searchParams.get('clientName');

	return NextResponse.json({ conferenceSid, clientName });
}
