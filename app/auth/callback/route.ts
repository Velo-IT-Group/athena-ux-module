import { NextRequest, NextResponse } from 'next/server';
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server';
import { getWorkers } from '@/lib/twilio/read';
import { createWorker } from '@/lib/twilio/create';
import { getContacts, getSystemMembers } from '@/lib/manage/read';

export async function GET(request: NextRequest) {
	const { searchParams, origin } = request.nextUrl;

	const code = searchParams.get('code');
	const email = searchParams.get('email') as string;
	// if "next" is in param, use it as the redirect URL
	const next = searchParams.get('next') ?? '/';
	

	console.log(code, next, origin, searchParams);

	if (code) {
		const supabase = createClient();
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
			const isLocalEnv = process.env.NODE_ENV === 'development';
			
			const workers = await getWorkers({ friendlyName: email }) 
			const { data: { user } } = await supabase.auth.getUser()

			console.log(user)
			
			if (!workers.length) {
				const [members, { data: contacts }] = await Promise.all([
					getSystemMembers({ conditions: { officeEmail: `'${user?.email}'` } }),
					getContacts({ childConditions: { 'communicationItems/value': `'${user?.email}'` } }),
				]);
				console.log(user)
				
				const worker = await createWorker(email, {
					contact_uri: `client:${email}`,
					on_call: false,
					...user?.user_metadata,
					
				})
				console.log(worker)
				await supabase.auth.updateUser({
					data: {
						...user?.user_metadata,
						workerSid: worker?.sid,
						referenceId: members?.[0]?.id ?? 310,
						contactId: contacts?.[0]?.id ?? 32569,
					},
				});
				await supabase.from('profiles').update({ worker_sid: worker?.sid })
				// try {
				// } catch (error) {
				// 	console.log(error)
				// }
			} else {
				await supabase.auth.updateUser({
					data: {
						...user?.user_metadata,
						workerSid: workers[0].sid
					}
				})
			}

			if (isLocalEnv) {
				// we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
				return NextResponse.redirect(`${origin}${next}`);
			} else if (forwardedHost) {
				return NextResponse.redirect(`${origin}${next}`);

				// return NextResponse.redirect(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? forwardedHost}${next}`);
			} else {
				return NextResponse.redirect(`${origin}${next}`);
			}
		}
	}

	// return the user to an error page with instructions
	return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
