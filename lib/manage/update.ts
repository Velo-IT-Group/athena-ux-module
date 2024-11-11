// 'use server';
import { userHeaders } from '../utils';
import getQueryClient from '@/app/getQueryClient';
import { useMutation } from '@tanstack/react-query';

export type PathOperation = {
	op: 'replace' | 'add' | 'remove' | 'copy' | 'move' | 'test';
	path: string;
	value: any;
};

const client = getQueryClient()


export const updateTicket = useMutation({
	mutationFn: async ({ id, operation }: { id: number, operation: PathOperation[] }) => await fetch(`${process.env.CONNECT_WISE_URL}/service/tickets/${id}`, {
		headers: userHeaders,
		method: 'patch',
		body: JSON.stringify(operation),
	}),
	onSuccess: () => {
		client.invalidateQueries({ queryKey: ['tickets'] })
	},
})

export const updateCompanyNote = useMutation({
	mutationFn: async ({ companyId, id, operation }: { companyId: number, id: number, operation: PathOperation[] }) => await fetch(`${process.env.CONNECT_WISE_URL}/company/companies/${companyId}/notes/${id}`, {
		headers: userHeaders,
		method: 'patch',
		body: JSON.stringify(operation),
	}),
	onSuccess: () => {
		client.invalidateQueries({ queryKey: ['companyNotes'] })
	},
})