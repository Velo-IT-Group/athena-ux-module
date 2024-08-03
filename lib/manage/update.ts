'use server';
import { baseHeaders } from '@/utils/manage/params';
import { revalidatePath } from 'next/cache';

export type PathOperation = {
	op: 'replace' | 'add' | 'remove' | 'copy' | 'move' | 'test';
	path: string;
	value: any;
};

export const updateTicket = async (id: number, operation: PathOperation[]) => {
	console.log(operation);
	const headers = new Headers(baseHeaders);
	headers.set('access-control-allow-origin', '*');

	console.log(headers);
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/service/tickets/${id}`, {
		headers,
		method: 'patch',
		body: JSON.stringify(operation),
	});

	if (response.status !== 200) throw Error(response.statusText);

	revalidatePath('/');

	return await response.json();
};
