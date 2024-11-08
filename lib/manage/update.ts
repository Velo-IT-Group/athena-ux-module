'use server';
import { revalidatePath } from 'next/cache';
import { userHeaders } from '../utils';

export type PathOperation = {
	op: 'replace' | 'add' | 'remove' | 'copy' | 'move' | 'test';
	path: string;
	value: any;
};

export const updateTicket = async (id: number, operation: PathOperation[]) => {
	// console.log(id, operation, `${process.env.CONNECT_WISE_URL}/service/tickets/${id}`);
	// const headers = new Headers(baseHeaders);
	// headers.set('access-control-allow-origin', '*');
	// console.log(headers);
	const response = await fetch(`${process.env.CONNECT_WISE_URL}/service/tickets/${id}`, {
		headers: userHeaders,
		method: 'patch',
		body: JSON.stringify(operation),
	});

	console.log(response);

	if (!response.ok) throw new Error(response.statusText, { cause: response.statusText });

	revalidatePath('/');

	return await response.json();
};

export const updateCompanyNote = async (companyId: number, id: number, operation: PathOperation[]) => {	
	const response = await fetch(`${process.env.CONNECT_WISE_URL}/company/companies/${companyId}/notes/${id}`, {
		headers: userHeaders,
		method: 'patch',
		body: JSON.stringify(operation),
	});

	const data = await response.json();
	console.log(data)

	if (!response.ok) throw new Error(response.statusText, { cause: response.statusText });

	revalidatePath('/');

	return data
};
