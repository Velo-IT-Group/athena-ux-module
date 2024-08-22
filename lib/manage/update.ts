'use server';
import { baseHeaders } from '@/utils/manage/params';
import { revalidatePath } from 'next/cache';

export type PathOperation = {
	op: 'replace' | 'add' | 'remove' | 'copy' | 'move' | 'test';
	path: string;
	value: any;
};

export const updateTicket = async (id: number, operation: PathOperation[]) => {
	console.log(id, operation, `${process.env.CONNECT_WISE_URL}/service/tickets/${id}`);
	const headers = new Headers(baseHeaders);
	headers.set('access-control-allow-origin', '*');

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
