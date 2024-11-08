import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sign } from 'jsonwebtoken'

export type WebToken = {
  user_id: string,
  connect_wise: {
    public_key: string,
    secret_key: string
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const response = await request.json()
  const data = response as WebToken;

  const value = sign(data, process.env.SECRET_KEY! + data.user_id, {})  

  const { error } = await supabase.from('profile_keys').insert({
    user_id: response.user_id,
    key: value
  })

  if (error) {
    return NextResponse.json(
      error,
      { status: 400 }
    )
  }
	
  return NextResponse.json(
    value,
		{status: 200}
	)
}
