'use server';

import { createClient } from '@/utils/twilio';

export async function fetchSummary() {
	const client = createClient();
	return await client.insights.v1.conferences.list({ limit: 20 });
}
