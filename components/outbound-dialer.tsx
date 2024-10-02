'use client';
import React, { useState } from 'react';
import OutboundDialerContent from './outbound-dialer-content';
import { useWorker } from '@/providers/worker-provider';
import { parsePhoneNumber } from '@/lib/utils';
import { toast } from 'sonner';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { BellRing, FlaskConical } from 'lucide-react';
import { useDevice } from '@/providers/device-provider';
import { lookupPhoneNumber } from '@/lib/twilio/phoneNumbers';

type Props = {};

const numbers = {
	'214': '+12142148356',
	'281': '+12817208356',
	'337': '+13377067517',
};

const OutboundDialer = (props: Props) => {
	const [isRinging, setIsRinging] = useState(false);
	const { worker } = useWorker();
	const { currentCallControl, testDevice } = useDevice();

	return (
		<div className='space-y-1.5'>
			<OutboundDialerContent
				numbers={[]}
				onSubmit={async (data) => {
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
				}}
			/>

			<Separator />

			<div className='flex items-center gap-1.5'>
				<Button
					variant='outline'
					size='icon'
					className='shrink-0'
					onClick={async () => {
						try {
							// await webHidPairing();
							// currentCallControl?.takeCallLock();
							console.log(currentCallControl);
							currentCallControl?.ring(!isRinging);
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
						// currentCallControl?.ring(!isRinging);
						testDevice();
						// setIsRinging((prev) => !prev);
					}}
				>
					<FlaskConical />
				</Button>

				{/* <Button
					variant='outline'
					size='icon'
					className='shrink-0'
				>
					<Mic />
				</Button> */}

				{/* <Progress
					value={volumeLevel}
					className='shrink grow-0'
				/> */}

				{/* <Button
					variant='outline'
					size='icon'
					className='shrink-0'
					onClick={() => {
						device?.connect({ params: { To: '+19032962250' } });
					}}
				>
					<Volume2 />
				</Button> */}
			</div>
		</div>
	);
};

export default OutboundDialer;
