import { NextRequest, NextResponse } from 'next/server';
import {randomBytes, createCipheriv} from 'crypto'
import { createClient } from '@/utils/supabase/server';
import { Json } from '@/types/supabase';

const encryptSymmetric = (key: string, plaintext: string) => {
  const iv = randomBytes(12).toString('base64');
  const cipher = createCipheriv(
    "aes-256-gcm", 
    Buffer.from(key, 'base64'), 
    Buffer.from(iv, 'base64')
  );
  let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
  ciphertext += cipher.final('base64');
  const tag = cipher.getAuthTag()
  
  return { ciphertext, iv, tag }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const body = await request.json()

  const plaintext = body.value;
  const key = randomBytes(32).toString('base64');

  const { ciphertext, iv, tag } = encryptSymmetric(key, plaintext);
  const encrypt = encryptSymmetric(key, plaintext);

  const { error } = await supabase.from('profile_keys').insert({
    user_id: body.user_id,
    is_secret: body.is_secret,
    iv,
    tag: tag as unknown as Json,
    key: ciphertext
  })

  if (error) {
    return NextResponse.json(
      error,
      { status: 400 }
    )
  }
	
  return NextResponse.json(
    encrypt,
		{status: 200}
	)
}
