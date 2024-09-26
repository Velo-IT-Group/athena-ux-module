'use client';
import React from 'react';
import OutboundDialerContent from './outbound-dialer-content';
import { useWorker } from '@/providers/worker-provider';
import { parsePhoneNumber } from '@/lib/utils';
import { toast } from 'sonner';

type Props = {};

const numbers = {
	'214': '+12142148356',
	'281': '+12817208356',
	'337': '+13377067517',
};

const OutboundDialer = (props: Props) => {
	const { worker } = useWorker();

	return (
		<OutboundDialerContent
			numbers={[]}
			onSubmit={(data) => {
				try {
					const to = data.get('To') as string;
					const splitNumber: string[] = to.split(' ');
					const areaCode = splitNumber?.[1];
					worker?.createTask(
						parsePhoneNumber(to, 'US', 'E.164').formattedNumber ?? '',
						// @ts-ignore
						(numbers[areaCode] as string) ?? process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER,
						process.env.NEXT_PUBLIC_TWILIO_WORKFLOW_SID!,
						process.env.NEXT_PUBLIC_TWILIO_TASK_QUEUE_SID!,
						{
							attributes: {
								direction: 'outbound',
							},
							taskChannelUniqueName: 'voice',
						}
					);
				} catch (error) {
					toast.error(JSON.stringify(error, null, 2));
				}
			}}
		/>
	);
};

export default OutboundDialer;
