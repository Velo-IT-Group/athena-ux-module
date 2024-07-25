import { NextRequest, NextResponse } from 'next/server';
import { config } from './auth';
import NextAuth from 'next-auth';

// Use only one of the two middleware options below
// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig)

// 2. Wrapped middleware option
const { auth } = NextAuth(config);
export default auth(async function middleware(request: NextRequest) {
	// Store current request url in a custom header, which you can read later
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set('x-url', request.url);

	return NextResponse.next({
		request: {
			// Apply new request headers
			headers: requestHeaders,
		},
	});
});
