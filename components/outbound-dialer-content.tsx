import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Grip, Phone, PhoneOutgoing, Settings } from 'lucide-react';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Call } from '@/app/(user)/history/page';

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
	const response = await fetch('https://voice.twilio.com/v1/DialingPermissions/Countries', requestOptions);
	const outBoundResponse = await fetch(
		`https://api.twilio.com/2010-04-01/Accounts/${process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID}/Calls.json?From=client:nblack_40velomethod_2Ecom&PageSize=10`,
		requestOptions
	);

	const inboundResponse = await fetch(
		`https://api.twilio.com/2010-04-01/Accounts/${process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID}/Calls.json?To=client:nblack_40velomethod_2Ecom&PageSize=10`,
		requestOptions
	);

	const { calls: outboundCalls }: { calls: Call[] } = await outBoundResponse.json();
	const { calls: inboundCalls }: { calls: Call[] } = await inboundResponse.json();
	const calls = [...inboundCalls, ...outboundCalls].sort((a, b) => {
		return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
	});
	return (
		<SheetContent className='sm:max-w-md'>
			<SheetHeader>
				<SheetTitle>Dial number</SheetTitle>
			</SheetHeader>

			<form
				action=''
				className='space-y-1.5'
			>
				<div className='flex items-center justify-end'>
					<Button
						variant='ghost'
						size='icon'
					>
						<Grip className='w-3.5 h-3.5' />
					</Button>

					<Button
						variant='ghost'
						size='icon'
					>
						<Settings className='w-3.5 h-3.5' />
					</Button>
				</div>

				<div className='flex items-center border rounded-md'>
					<div className='bg-secondary h-10 grid place-items-center px-3 text-sm'>+1</div>

					<Input
						placeholder='(555) 555-5555'
						className='border-none'
					/>
				</div>

				<Button className='w-full space-x-1.5'>
					<Phone className='w-3.5 h-3.5' /> <span>Call</span>
				</Button>

				<Separator />

				<h2 className='text-lg font-medium'>Recents</h2>

				<Table className='flex flex-col min-h-0'>
					<TableBody className='overflow-scroll'>
						{calls.map((call) => (
							<TableRow
								key={call.sid}
								className='group'
							>
								<TableCell>{call.direction === 'outbound-dial' && <PhoneOutgoing className='w-3.5 h-3.5' />}</TableCell>
								<TableCell className='max-w-16 text-ellipsis overflow-hidden'>{call.from}</TableCell>
								<TableCell className='text-nowrap text-ellipsis'>Remy Morris</TableCell>
								<TableCell>
									<span className='group-hover:hidden'>
										{Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short' }).format(
											new Date(call.date_created)
										)}
									</span>
									<Button
										variant='ghost'
										size='sm'
										className='h-auto hidden group-hover:flex items-center gap-1.5'
										type='button'
									>
										<Phone className='w-3.5 h-3.5' /> Call
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</form>
		</SheetContent>
	);
};

export default OutboundDialerContent;
