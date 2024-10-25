'use client';
import React, { useEffect, useState } from 'react';
import { Phone, X } from 'lucide-react';
import { Dialpad } from '../dialpad';
import { Button } from '../ui/button';
import { PhoneInput } from '../phone-input';
import { outboundPhoneSchema } from '../outbound-dialer-content';
import { lookupPhoneNumber } from '@/lib/twilio/phoneNumbers';
import { useWorker } from '@/providers/worker-provider';
import { z } from 'zod';
import { parsePhoneNumber } from '@/lib/utils';
import { toast } from 'sonner';
import { numbers } from '../outbound-dialer';

type Props = {};

const OutboundDial = ({}: Props) => {
	const { worker } = useWorker();
	const [value, setValue] = useState('+1');

	useEffect(() => {
		console.log(value);
	}, [value]);

	async function onSubmit(values: z.infer<typeof outboundPhoneSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		try {
			const to = values.To;
			const splitNumber: string[] = to.split(' ');
			const areaCode = splitNumber?.[1];
			const numberReturn = await lookupPhoneNumber(to);
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
						userId: numberReturn?.userId,
					},
					taskChannelUniqueName: 'voice',
				}
			);
		} catch (error) {
			toast.error(JSON.stringify(error, null, 2));
		}
	}

	const isValid = parsePhoneNumber(value).isValid;

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				const to = value;
				const splitNumber: string[] = to.split(' ');
				const areaCode = splitNumber?.[1];
				const numberReturn = await lookupPhoneNumber(to);
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
							userId: numberReturn?.userId,
						},
						taskChannelUniqueName: 'voice',
					}
				);
			}}
			className='bg-muted flex w-full max-w-[285px] flex-col items-center justify-center gap-y-3 rounded-xl border py-3 px-1.5'
		>
			<PhoneInput
				value={value}
				onChange={(e) => setValue(e.target.value)}
				autoFocus
			/>

			<div className='p-3 bg-background rounded-lg w-full border'>
				<Dialpad
					onValueChange={(e) => {
						console.log(e);
						setValue((prev) => prev + e);
					}}
				/>
			</div>

			<div className='w-full grid grid-cols-3 gap-1.5 place-items-center'>
				<div></div>

				<Button
					type='submit'
					size='icon'
					className='rounded-full'
					disabled={!isValid}
				>
					<Phone />
					<span className='sr-only'>Dial</span>
				</Button>

				<Button
					variant='secondary'
					size='icon'
					className='rounded-full'
					type='button'
					onClick={() => setValue((prev) => prev.substring(0, prev.length - 1))}
				>
					<X />
				</Button>
			</div>

			{/* <div className='flex flex-col items-center justify-center gap-2'>
				<div className='flex items-center justify-center rounded-full border bg-background p-2'>
					<PhoneOutgoing />
				</div>
				<div className='flex flex-col items-center justify-center gap-1 px-2'>
					<span className='text-base font-medium '>Make Call</span>
					<span className='w-full text-center text-sm text-muted-foreground'>
						Choose who can comment on deployments for feature/additional-design-changes.
					</span>
				</div>
			</div> */}
		</form>
	);
};

export default OutboundDial;
