import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams

	if (searchParams.has("validationToken")) {
		const validationToken = searchParams.get("validationToken")
		return new Response(validationToken, { status: 200 })
	}
	
  return NextResponse.json(
		{status: 200}
	)
}
