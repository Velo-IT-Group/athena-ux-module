import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Props = {};

export type Call = {
	date_updated: string;
	price_unit: string;
	parent_call_sid: any;
	caller_name?: string;
	duration: string;
	from: string;
	to: string;
	annotation: any;
	answered_by: any;
	sid: string;
	queue_time: string;
	price?: string;
	api_version: string;
	status: string;
	direction: string;
	start_time: string;
	date_created: string;
	from_formatted: string;
	group_sid: any;
	trunk_sid: string;
	forwarded_from?: string;
	uri: string;
	account_sid: string;
	end_time: string;
	to_formatted: string;
	phone_number_sid?: string;
};

const Page = async ({}: Props) => {
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

	const { calls: outboundCalls }: { calls: Call[] } = await outBoundResponse.json();
	const { calls: inboundCalls }: { calls: Call[] } = await inboundResponse.json();
	const calls = [...inboundCalls, ...outboundCalls].sort((a, b) => {
		return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
	});

	return (
		<main className='min-h-screen p-3'>
			<h1 className='text-2xl font-semibold'>Calls</h1>

			<Table>
				<TableCaption>A list of your recent invoices.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Phone Number</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Date & Time</TableHead>
						<TableHead>Duration</TableHead>
						<TableHead>Queue</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{calls.map((call) => (
						<TableRow key={call.sid}>
							<TableCell className='font-medium'>{call.from}</TableCell>
							<TableCell>{call.to}</TableCell>
							<TableCell>{call.start_time}</TableCell>
							<TableCell>{call.duration}</TableCell>
							<TableCell>{call.queue_time}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</main>
	);
};

export default Page;
