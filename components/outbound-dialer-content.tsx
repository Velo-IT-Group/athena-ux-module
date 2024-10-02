'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PhoneInput } from './phone-input';
import { Form, FormField } from './ui/form';
import { useForm } from 'react-hook-form';
import { CreateParticipantParams, createPartipantParamsSchema } from '@/types/twilio';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWorker } from '@/providers/worker-provider';
import { lookupPhoneNumber } from '@/lib/twilio/phoneNumbers';
import { parsePhoneNumber } from '@/lib/utils';
import { z } from 'zod';
import { toast } from 'sonner';

type Props = {
	showNumbers?: boolean;
	numbers: { phoneNumber: string; friendlyName: string }[];
	onSubmit?: (data: FormData) => void;
};

const formSchema = z.object({
	phoneNumber: z.string().min(2, {
		message: 'Username must be at least 2 characters.',
	}),
});

const OutboundDialerContent = ({ showNumbers = false, numbers }: Props) => {
	const [isDisabled, setIsDisabled] = useState(false);
	const { worker } = useWorker();
	const form = useForm<CreateParticipantParams>({
		resolver: zodResolver(createPartipantParamsSchema),
	});

	return (
		<Form {...form}>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					setIsDisabled(true);
					const data = new FormData(e.currentTarget);
					try {
						const to = data.get('To') as string;
						const splitNumber: string[] = to.split(' ');
						const areaCode = splitNumber?.[1];
						const numberReturn = await lookupPhoneNumber(to);
						worker?.createTask(
							parsePhoneNumber(to, 'US', 'E.164').formattedNumber ?? '',
							// @ts-ignore
							(numbers[areaCode] as string) ?? process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER,
							process.env.NEXT_PUBLIC_TWILIO_WORKFLOW_SID!,
							process.env.NEXT_PUBLIC_TWILIO_TASK_QUEUE_SID!,
							{
								attributes: {
									direction: 'outbound',
									name: numberReturn?.name,
									companyId: numberReturn?.companyId,
									contactId: numberReturn?.userId,
								},
								taskChannelUniqueName: 'voice',
							}
						);
					} catch (error) {
						toast.error(JSON.stringify(error, null, 2));
					}

					setIsDisabled(false);
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
					disabled={isDisabled}
				>
					Dial
				</Button>
			</form>
		</Form>
	);
};

export default OutboundDialerContent;
