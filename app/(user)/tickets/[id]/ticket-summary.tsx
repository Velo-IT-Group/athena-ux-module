'use client';
import getQueryClient from '@/app/getQueryClient';
import { Textarea } from '@/components/ui/textarea';
import { updateTicket } from '@/lib/manage/update';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';

type Props = {
	id: number;
	summary: string;
};

const TicketSummary = ({ id, summary }: Props) => {
	const ticketMutation = useMutation({
		mutationFn: async (
			e: React.FocusEvent<HTMLTextAreaElement, Element>
		) => {
			console.log(e.currentTarget.value);
			await updateTicket(id, [
				{
					op: 'replace',
					path: '/summary',
					value: e.currentTarget.value,
				},
			]);
		},
		onSuccess(data, variables, context) {
			// const client = getQueryClient();
			// client.invalidateQueries(['ticket', id])
		},
		onError(error, variables, context) {
			console.error(error);
			toast.error('Failed to update ticket summary');
		},
	});
	return (
		<Textarea
			name="summary"
			defaultValue={summary}
			onBlur={ticketMutation.mutate}
			className="border-none text-2xl font-semibold focus-visible:ring-0 shadow-none"
			// readOnly
		/>
	);
};

export default TicketSummary;
