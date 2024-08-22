'use server';
import { CommunicationItem, TicketNote } from '@/types/manage';
import { baseHeaders } from '@/utils/manage/params';
import { revalidatePath } from 'next/cache';

export type PathOperation = {
	op: 'replace' | 'add' | 'remove' | 'copy' | 'move' | 'test';
	path: string;
	value: any;
};

export const createTicketNote = async (id: number, body: TicketNote) => {
	const headers = new Headers(baseHeaders);
	headers.set('access-control-allow-origin', '*');

	const response = await fetch(`${process.env.CONNECT_WISE_URL}/service/tickets/${id}/notes`, {
		headers,
		method: 'post',
		body: JSON.stringify(body),
	});

	console.log(response.status);

	if (response.status !== 201) throw Error(response.statusText);

	revalidatePath('/');

	return await response.json();
};

export const createContactCommunication = async (id: number, body: CommunicationItem) => {
	const headers = new Headers(baseHeaders);
	headers.set('access-control-allow-origin', '*');

	const response = await fetch(`${process.env.CONNECT_WISE_URL}/company/contacts/${id}/communications`, {
		headers,
		method: 'post',
		body: JSON.stringify(body),
	});

	console.log(response.status);

	if (response.status !== 201) throw Error(response.statusText);

	revalidatePath('/');

	return await response.json();
};
