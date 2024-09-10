'use server';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const signInWithAzure = async (formData: FormData) => {
	const supabase = createClient();

	const getURL = () => {
		let url =
			process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
			process?.env?.VERCEL_PROJECT_PRODUCTION_URL ?? // Automatically set by Vercel.
			'http://localhost:3000/';
		// Make sure to include `https://` when not localhost.
		url = url.startsWith('http') ? url : `https://${url}`;
		// Make sure to include a trailing `/`.
		url = url.endsWith('/') ? url : `${url}/`;
		return url;
	};

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
