import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Grip, History, Phone, PhoneOutgoing, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Call } from '@/app/(user)/history/page';
import { PopoverContent } from './ui/popover';
import { Dialpad } from './dialpad';
import { Combobox } from './ui/combobox';

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
		<PopoverContent>
			{/* <SheetHeader>
				<SheetTitle>Dial number</SheetTitle>
			</SheetHeader> */}

			<form
				action=''
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
						placeholder=''
						value={''}
						align='end'
						// setValue={() => {}}
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
						className='text-xl'
					>
						0
					</Button>
				</div>

				<Separator />

				<Button className='w-full space-x-1.5'>
					<Phone className='w-3.5 h-3.5' /> <span>Call</span>
				</Button>

				{/* <Separator />

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
				</Table> */}
			</form>
		</PopoverContent>
	);
};

export default OutboundDialerContent;
