'use client';
import { parsePhoneNumber } from '@/lib/utils';
import React, { useTransition } from 'react';
import { Button } from './ui/button';
import { useWorker } from '@/providers/worker-provider';
import { RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
	phoneNumber: string;
};

const PhoneNumberButton = ({ phoneNumber }: Props) => {
	const [isPending, startTransition] = useTransition();
	const { worker } = useWorker();
	const parsedPhoneNumber = parsePhoneNumber(phoneNumber);

	return (
		<>
			{parsedPhoneNumber.options && (
				<Button
					variant='secondary'
					size='sm'
					onClick={() => {
						startTransition(async () => {
							if (!parsedPhoneNumber.options?.formatInternational) return;
							try {
								await worker?.createTask(
									parsedPhoneNumber.options?.formatInternational(),
									'+18449402678',
									'WW497b90bc1703176f6845c09c8bf4fa8a',
									'WQee659e96340b3899ad1fad7578fe6515',
									{
										attributes: {
											direction: 'outboundDial',
										},
									}
								);
							} catch (error) {
								console.error(error);
								toast.error('Failed to create task');
							}
						});
					}}
				>
					{parsedPhoneNumber.formattedNumber}
					{isPending && <RefreshCcw className='w-4 h-4 ml-2 animate-spin' />}
				</Button>
			)}
		</>
	);
};

export default PhoneNumberButton;
