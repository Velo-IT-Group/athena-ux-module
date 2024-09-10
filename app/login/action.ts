'use server';
import { getContacts, getSystemMembers } from '@/lib/manage/read';
import { findWorker } from '@/lib/twilio/taskrouter/helpers';
import { createClient } from '@/utils/supabase/server';
import { redirect, RedirectType } from 'next/navigation';

const getURL = () => {
	let url =
		process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
		process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
		'http://localhost:3000/';
	// Make sure to include `https://` when not localhost.
	url = url.startsWith('http') ? url : `https://${url}`;
	// Make sure to include a trailing `/`.
	url = url.endsWith('/') ? url : `${url}/`;
	return url;
};

export const signInWithAzure = async (formData: FormData) => {
	const supabase = createClient();

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'azure',
		options: {
			scopes: 'openid profile email User.Read Calendars.ReadBasic Calendars.Read Calendars.ReadWrite',
			redirectTo: `${getURL()}/auth/callback`,
		},
	});

	if (data.url) {
		return redirect(data.url); // use the redirect API for your server framework
	}
};

export const signInWithPassword = async (data: FormData) => {
	const supabase = createClient();

	const email = data.get('email') as string;
	const password = data.get('password') as string;

	try {
		const {
			data: { user },
			error,
		} = await supabase.auth.signInWithPassword({ email, password });
		if (error) throw Error(error.message);
		const [worker, members, contacts] = await Promise.all([
			findWorker(user?.email ?? ''),
			getSystemMembers({ conditions: [{ parameter: { officeEmail: `'${user?.email}'` } }] }),
			getContacts({ childConditions: [{ parameter: { 'communicationItems/value': `'${user?.email}'` } }] }),
		]);

		const data = {
			...user?.user_metadata,
			workerSid: worker?.sid,
			referenceId: members?.[0]?.id ?? 310,
			contactId: contacts?.[0]?.id ?? 32569,
		};

		console.log(data, worker, members, contacts);

		await supabase.auth.updateUser({
			data,
		});
	} catch (error) {
		console.error(error as string);
	} finally {
		redirect(`/`, RedirectType.replace);
	}
};
