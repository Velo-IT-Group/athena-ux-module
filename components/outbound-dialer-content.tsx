import React from 'react';
import { Button } from '@/components/ui/button';
import { History, Phone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Call } from '@/app/(user)/history/page';
import { PopoverContent } from '@/components/ui/popover';
import { Dialpad } from './dialpad';
import { Combobox } from '@/components/ui/combobox';
import { call } from '@/lib/twilio/read';
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type Props = {};

const OutboundDialerContent = async (props: Props) => {
	const myHeaders = new Headers();
	myHeaders.append(
		'Authorization',
		`Basic ${btoa(`${process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID}:${process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN}`)}`
	);

	const requestOptions: RequestInit = {
		method: 'GET',
		headers: myHeaders,
	};

	const outBoundResponse = await fetch(
		`https://api.twilio.com/2010-04-01/Accounts/${process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID}/Calls.json?From=client:nblack_40velomethod_2Ecom&PageSize=10`,
		requestOptions
	);

	const inboundResponse = await fetch(
		`https://api.twilio.com/2010-04-01/Accounts/${process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID}/Calls.json?To=client:nblack_40velomethod_2Ecom&PageSize=10`,
		requestOptions
	);

	const { calls: inboundCalls }: { calls: Call[] } = await inboundResponse.json();

	return (
		<PopoverContent align='end'>
			<form
				action={async (data: FormData) => {
					'use server';
					const callerId = data.get('callerId') as string;
					const phone = data.get('phoneNumber') as string;
					await call('', callerId, phone);
				}}
				className='space-y-1.5'
			>
				<Dialpad />

				<div className='grid grid-cols-3 gap-1.5 w-full'>
					<Combobox
						items={inboundCalls.map((c) => {
							return {
								label: `${c.from_formatted} - ${Intl.DateTimeFormat('en-US', {
									dateStyle: 'short',
									timeStyle: 'short',
								}).format(new Date(c.start_time))}`,
								value: `${c.from_formatted} - ${c.sid}`,
							};
						})}
						placeholder='Filter calls...'
						value={''}
						align='start'
						side='left'
					>
						<Button
							variant='ghost'
							size='lg'
							className='text-xl'
						>
							<History className='font-medium' />
						</Button>
					</Combobox>

					<Button
						variant='ghost'
						size='lg'
						type='button'
						className='text-xl'
					>
						0
					</Button>
				</div>

				<Separator />

				<Label>Caller ID</Label>
				<Select>
					<SelectTrigger>
						<SelectValue placeholder='Select caller id...' />
					</SelectTrigger>
				</Select>

				<Separator />

				<Button className='w-full space-x-1.5'>
					<Phone className='w-3.5 h-3.5' /> <span>Call</span>
				</Button>
			</form>
		</PopoverContent>
	);
};

export default OutboundDialerContent;
