'use client';
import React from 'react';
import OutboundDialerContent from './outbound-dialer-content';
import { useWorker } from '@/providers/worker-provider';
import { parsePhoneNumber } from '@/lib/utils';
import { toast } from 'sonner';

type Props = {};

const OutboundDialer = (props: Props) => {
	const { worker } = useWorker();

	return (
		<OutboundDialerContent
			numbers={[]}
			onSubmit={(data) => {
				try {
					worker?.createTask(
						parsePhoneNumber(data.get('To') as string, 'US', 'E.164').formattedNumber ?? '',
						'+18449402678',
						'WW497b90bc1703176f6845c09c8bf4fa8a',
						'WQee659e96340b3899ad1fad7578fe6515',
						{
							attributes: {
								direction: 'outbound',
							},
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
