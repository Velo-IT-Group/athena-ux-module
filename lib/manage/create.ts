import { CommunicationItem, createNoteSchema, TicketNote } from '@/types/manage';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { userHeaders } from '../utils';
import getQueryClient from '@/app/getQueryClient';

export type PathOperation = {
	op: 'replace' | 'add' | 'remove' | 'copy' | 'move' | 'test';
	path: string;
	value: any;
};

const client = getQueryClient()

export const createTicketNote = useMutation({
	mutationFn: ({ id, body }: { id: number, body: TicketNote }) => fetch(`${process.env.CONNECT_WISE_URL}/service/tickets/${id}/notes`, {
		headers: userHeaders,
		method: 'post',
		body: JSON.stringify(body),
	}),
	onSuccess: () => {
		client.invalidateQueries({ queryKey: ['ticketNotes'] })
	},
})

export const createContactCommunication = useMutation({
	mutationFn: ({ id, body }: { id: number, body: CommunicationItem }) => fetch(`${process.env.CONNECT_WISE_URL}/company/contacts/${id}/communications`, {
		headers: userHeaders,
		method: 'post',
		body: JSON.stringify(body),
	}),
	onSuccess: () => {
		client.invalidateQueries({ queryKey: ['contactCommunications'] })
	},
})

export const createCompanyNote = useMutation({
	mutationFn: ({ companyId, body }: { companyId: number, body: z.infer<typeof createNoteSchema> }) => fetch(`${process.env.CONNECT_WISE_URL}/company/companies/${companyId}/notes`, {
		headers: userHeaders,
		method: 'post',
		body: JSON.stringify(body),
	}),
	onSuccess: () => {
		client.invalidateQueries({ queryKey: ['companyNotes'] })
	},
})