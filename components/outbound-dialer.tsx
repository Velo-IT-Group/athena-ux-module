'use client';
import React, { useState } from 'react';
import OutboundDialerContent, { outboundPhoneSchema } from './outbound-dialer-content';
import { useWorker } from '@/providers/worker-provider';
import { parsePhoneNumber } from '@/lib/utils';
import { toast } from 'sonner';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { BellRing, FlaskConical } from 'lucide-react';
import { useDevice } from '@/providers/device-provider';
import { lookupPhoneNumber } from '@/lib/twilio/phoneNumbers';
import useRinger from '@/hooks/useRinger';
import { z } from 'zod';

type Props = {};

export const numbers = {
	'214': '+12142148356',
	'281': '+12817208356',
	'337': '+13377067517',
};

const OutboundDialer = (props: Props) => {
	const [isRinging, setIsRinging] = useState(false);
	const { worker } = useWorker();
	const { currentCallControl, testDevice } = useDevice();
	const { playing, togglePlayback } = useRinger();

	async function onSubmit(values: z.infer<typeof outboundPhoneSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		try {
			const to = values.To;
			const splitNumber: string[] = to.split(' ');
			const areaCode = splitNumber?.[1];
			const numberReturn = await lookupPhoneNumber(to);
			console.log(to, splitNumber, areaCode, numberReturn);
			await worker?.createTask(
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
	}

	return (
		<div className='space-y-1.5'>
			<OutboundDialerContent
				numbers={[]}
				onSubmit={onSubmit}
			/>

			<Separator />

			<div className='flex items-center gap-1.5'>
				<Button
					variant='outline'
					size='icon'
					className='shrink-0'
					onClick={() => {
						try {
							console.log(currentCallControl);
							togglePlayback(!playing);
							setIsRinging((prev) => !prev);
						} catch (error) {
							console.error(error);
							toast.error(JSON.stringify(error) as string);
						}
					}}
				>
					<BellRing />
				</Button>

				<Button
					variant='outline'
					size='icon'
					className='shrink-0'
					onClick={() => {
						testDevice();
					}}
				>
					<FlaskConical />
				</Button>
			</div>
		</div>
	);
};

export default OutboundDialer;
