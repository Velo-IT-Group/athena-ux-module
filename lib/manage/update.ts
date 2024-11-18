'use server';
import { userHeaders } from '../utils';

export type PathOperation = {
	op: 'replace' | 'add' | 'remove' | 'copy' | 'move' | 'test';
	path: string;
	value: any;
};

export const updateTicket = async (id: number, operation: PathOperation[]) => {
	let response = await fetch(`${process.env.CONNECT_WISE_URL}/service/tickets/${id}`, {
		headers: userHeaders,
		method: 'patch',
		body: JSON.stringify(operation),
	})

	return response.json()
}
export const updateCompanyNote = async ({ companyId, id, operation }: { companyId: number, id: number, operation: PathOperation[] }) => await fetch(`${process.env.CONNECT_WISE_URL}/company/companies/${companyId}/notes/${id}`, {
		headers: userHeaders,
		method: 'patch',
		body: JSON.stringify(operation),
	})