'use server';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

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

	console.log(email, password);

	try {
		const response = await supabase.auth.signInWithPassword({ email, password });
		if (response.error) throw Error(response.error.message);
		redirect(`${getURL()}/`);
	} catch (error) {
		console.error(error as string);
	}
};
