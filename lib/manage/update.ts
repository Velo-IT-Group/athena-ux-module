'use server';
import { decryptToken } from '@/utils/crypto';
import { baseHeaders } from '@/utils/manage/params';
import { revalidatePath } from 'next/cache';

const headers = new Headers(baseHeaders)

export type PathOperation = {
	op: 'replace' | 'add' | 'remove' | 'copy' | 'move' | 'test';
	path: string;
	value: any;
};

export const updateTicket = async (id: number, operation: PathOperation[]) => {
	const decryptedToken = decryptToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZTU1YWEzNjktY2E0ZS00ZWIyLTllMjUtN2I1NzE4MTA4MDk5IiwiY29ubmVjdF93aXNlIjp7InB1YmxpY19rZXkiOiJtYWFQaVZUZUV5YmJLM1NYIiwic2VjcmV0X2tleSI6ImVDVDFOYm9lTXJYcTlQM3oifSwiaWF0IjoxNzMxMDg1NzMzfQ.w-gQJFzwlU2STSJKivoDpB-DbNhZsM1DPZo9WxRUXnc", "e55aa369-ca4e-4eb2-9e25-7b5718108099")

	console.log(decryptedToken.connect_wise)

	headers.set(
		'Authorization',
		'Basic ' + btoa(decryptedToken.connect_wise.public_key + ':' + decryptedToken.connect_wise.secret_key)
	)
	// console.log(id, operation, `${process.env.CONNECT_WISE_URL}/service/tickets/${id}`);
	// const headers = new Headers(baseHeaders);
	// headers.set('access-control-allow-origin', '*');

	// console.log(headers);
	const response = await fetch(`${process.env.CONNECT_WISE_URL}/service/tickets/${id}`, {
		headers,
		method: 'patch',
		body: JSON.stringify(operation),
	});

	console.log(response);

	if (!response.ok) throw new Error(response.statusText, { cause: response.statusText });

	revalidatePath('/');

	return await response.json();
};

export const updateCompanyNote = async (companyId: number, id: number, operation: PathOperation[]) => {
	const decryptedToken = decryptToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZTU1YWEzNjktY2E0ZS00ZWIyLTllMjUtN2I1NzE4MTA4MDk5IiwiY29ubmVjdF93aXNlIjp7InB1YmxpY19rZXkiOiJtYWFQaVZUZUV5YmJLM1NYIiwic2VjcmV0X2tleSI6ImVDVDFOYm9lTXJYcTlQM3oifSwiaWF0IjoxNzMxMDg1NzMzfQ.w-gQJFzwlU2STSJKivoDpB-DbNhZsM1DPZo9WxRUXnc", "e55aa369-ca4e-4eb2-9e25-7b5718108099")
	
	console.log(decryptedToken.connect_wise)
	
	headers.set('access-control-allow-origin', '*');
	headers.set(
		'Authorization',
		'Basic ' + btoa(decryptedToken.connect_wise.public_key + ':' + decryptedToken.connect_wise.secret_key)
	)
	// console.log(headers);
	const response = await fetch(`${process.env.CONNECT_WISE_URL}/company/companies/${companyId}/notes/${id}`, {
		headers,
		method: 'patch',
		body: JSON.stringify(operation),
	});

	const data = await response.json();
	console.log(data)

	if (!response.ok) throw new Error(response.statusText, { cause: response.statusText });

	revalidatePath('/');

	return data
};
