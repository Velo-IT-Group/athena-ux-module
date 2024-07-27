import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
	const user = await kv.hgetall('setExample');

	console.log(user);

	return NextResponse.json(user);
}

export async function POST() {
	try {
		console.log('Setting');
		await kv.set('setExample', '123abc', { ex: 100, nx: true });
		return NextResponse.json({ message: 'Success' });
	} catch (error) {
		// Handle errors
	}
}
