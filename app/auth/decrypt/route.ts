import { decryptSymmetric } from '@/utils/crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const body = await request.json()
	const { text } = body;
	const { searchParams, origin } = request.nextUrl;
	const key = process.env.SECRET_KEY!

	
	return NextResponse.json({
		status: 200
	})
}
