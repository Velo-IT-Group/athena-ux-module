import { NextRequest, NextResponse } from 'next/server';
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server';
import { getWorkers } from '@/lib/twilio/read';
import { createWorker } from '@/lib/twilio/create';
import { getContacts, getSystemMembers } from '@/lib/manage/read';
import { updateWorker } from '@/lib/twilio/update';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { WorkerInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/worker';
import { cookies } from 'next/headers';

const updateUnknownWorker = async (supabase: SupabaseClient, user: User | null) => {
	const email = user?.email ?? ''
	const [members, { data: contacts }] = await Promise.all([
		getSystemMembers({ conditions: { officeEmail: `'${email}'` } }),
		getContacts({ childConditions: { 'communicationItems/value': `'${email}'` } }),
	]);
	
	const worker = await createWorker(email, {
		contact_uri: `client:${email}`,
		on_call: false,
		...user?.user_metadata,
		contact_id: contacts?.[0]?.id,
		member_id: members?.[0]?.id
	})

	await supabase.auth.updateUser({
		data: {
			...user?.user_metadata,
			workerSid: worker?.sid,
			referenceId: members?.[0]?.id ?? 310,
			contactId: contacts?.[0]?.id ?? 32569,
		},
	});
	
	await supabase.from('profiles').update({ worker_sid: worker?.sid }).eq('id', user?.id ?? '')
}

const updateKnownWorker = async (supabase: SupabaseClient, user: User | null, worker: WorkerInstance) => {
	const email = user?.email ?? ''
	const [members, { data: contacts }] = await Promise.all([
		getSystemMembers({ conditions: { officeEmail: `'${email}'` } }),
		getContacts({ childConditions: { 'communicationItems/value': `'${email}'` } }),
	]);
	
	await supabase.auth.updateUser({
		data: {
			...user?.user_metadata,
			workerSid: worker.sid
		}
	})

	await supabase.from('profiles').update({ worker_sid: worker.sid }).eq('id', user?.id ?? '')

	const parsedAttributes = JSON.parse(worker.attributes)

	await updateWorker(worker.sid, {
		attributes: {
			...parsedAttributes,
			contact_uri: `client:${email}`,
			contact_id: contacts?.[0]?.id,
			member_id: members?.[0]?.id
		}
	})
}

export async function GET(request: NextRequest) {
	const { searchParams, origin } = request.nextUrl;
	const cookieStore = await cookies()
	

	const code = searchParams.get('code');
	// if "next" is in param, use it as the redirect URL
	const next = searchParams.get('next') ?? '/';
	
	if (code) {
		const supabase = await createClient();
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		const { data } = await supabase.from('profile_keys').select().single();
		cookieStore.set('connect_wise:auth', JSON.stringify(data?.key))

		if (!error) {
			const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
			const isLocalEnv = process.env.NODE_ENV === 'development';
			
			const { data: { user } } = await supabase.auth.getUser()

			if (!user) return;

			const email = user.user_metadata.email;

			const workers = await getWorkers({ friendlyName: email }) 
			
			if (!workers.length) {
				await updateUnknownWorker(supabase, user)
			} else {
				await updateKnownWorker(supabase, user, workers[0])
			}

			if (isLocalEnv) {
				// we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
				return NextResponse.redirect(`${origin}${next}`);
			} else if (forwardedHost) {
				return NextResponse.redirect(`${origin}${next}`);
			} else {
				return NextResponse.redirect(`${origin}${next}`);
			}
		}
	}

	// return the user to an error page with instructions
	return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
