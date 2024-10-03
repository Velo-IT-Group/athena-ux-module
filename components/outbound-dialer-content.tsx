'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneInput } from './phone-input';
import { Form, FormField } from './ui/form';
import { useForm } from 'react-hook-form';
import { CreateParticipantParams, createPartipantParamsSchema } from '@/types/twilio';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = {
	showNumbers?: boolean;
	numbers: { phoneNumber: string; friendlyName: string }[];
	onSubmit?: (data: FormData) => void;
};

const OutboundDialerContent = ({ showNumbers = false, numbers, onSubmit }: Props) => {
	const form = useForm<CreateParticipantParams>({
		resolver: zodResolver(createPartipantParamsSchema),
	});

	return (
		<Form {...form}>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const data = new FormData(e.currentTarget);
					onSubmit?.(data);
				}}
				className='space-y-3'
			>
				<FormField
					control={form.control}
					name='To'
					render={({ field }) => <PhoneInput {...field} />}
				/>

				<Button
					type='submit'
					className='w-full'
					disabled={form.formState.disabled || form.formState.isSubmitting}
				>
					Dial
				</Button>
			</form>
		</Form>
	);
};

export default OutboundDialerContent;
