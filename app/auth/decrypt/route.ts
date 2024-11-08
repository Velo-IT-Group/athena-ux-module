import { NextRequest, NextResponse } from 'next/server';
import { WebToken } from '../encrypt/route';
import { verify } from 'jsonwebtoken';

type EncryptedValue = {
	user_id: string
	key: string;
}

export async function POST(request: NextRequest) {
	const response = await request.json()
  	const data = response as EncryptedValue;

	 const value = verify(data.key, process.env.SECRET_KEY! + data.user_id, {})  

	return NextResponse.json(
		value,
		{ status: 200 }
	)
}
