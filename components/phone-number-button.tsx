'use client';
import { parsePhoneNumber } from '@/lib/utils';
import React, { useTransition } from 'react';
import { Button } from './ui/button';
import { useWorker } from '@/providers/worker-provider';
import { RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from './ui/badge';

type Props = {
	phoneNumber: string;
	className?: string;
};

const PhoneNumberButton = ({ phoneNumber, className }: Props) => {
	const [isPending, startTransition] = useTransition();
	const { worker } = useWorker();
	const parsedPhoneNumber = parsePhoneNumber(phoneNumber);

	return (
		<>
			{parsedPhoneNumber.options && (
				<Button
					variant={null}
					size='sm'
					className={className}
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
					<Badge
						variant='outline'
						className='bg-blue-100 text-blue-800 hover:bg-blue-100/60 dark:bg-blue-900 dark:text-blue-300'
					>
						{parsedPhoneNumber.formattedNumber}
						{isPending && <RefreshCcw className='w-4 h-4 ml-2 animate-spin' />}
					</Badge>
				</Button>
			)}
		</>
	);
};

export default PhoneNumberButton;
