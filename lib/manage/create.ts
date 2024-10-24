'use server';
import { CommunicationItem, createNoteSchema, TicketNote } from '@/types/manage';
import { baseHeaders } from '@/utils/manage/params';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

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

export const createCompanyNote = async (companyId: number, operation: z.infer<typeof createNoteSchema>) => {
	const headers = new Headers(baseHeaders);
	headers.set('access-control-allow-origin', '*');

	// console.log(headers);
	const response = await fetch(`${process.env.CONNECT_WISE_URL}/company/companies/${companyId}/notes`, {
		headers,
		method: 'post',
		body: JSON.stringify(operation),
	});

	const data = await response.json()
	console.log(data);

	if (!response.ok) throw new Error(response.statusText, { cause: response.statusText });

	revalidatePath('/');

	return data;
};
