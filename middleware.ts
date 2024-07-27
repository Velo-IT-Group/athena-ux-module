import { NextRequest, NextResponse } from 'next/server';
import { config as authConfig } from './auth';
import NextAuth from 'next-auth';
import { get } from '@vercel/edge-config';

// Use only one of the two middleware options below
// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig);

export const config = { matcher: '/welcome' };

// // 2. Wrapped middleware option
const { auth } = NextAuth(authConfig);
export default auth(async function middleware(request: NextRequest) {
	const greeting = await get('greeting');
	// NextResponse.json requires at least Next v13.1 or
	// enabling experimental.allowMiddlewareResponseBody in next.config.js
	return NextResponse.json(greeting);
});
