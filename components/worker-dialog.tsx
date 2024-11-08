'use client';
import React, { Fragment } from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { getActivities, getTimeEntries } from '@/lib/manage/read';
import { ScrollArea } from './ui/scroll-area';
import { formatDate } from '@/utils/date';
import { Separator } from './ui/separator';
import { groupBy } from 'lodash';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Worker } from 'twilio-taskrouter';

type Props = {
	worker: Worker;
	workerAttributes: Record<string, any>;
};

type Log = {
	id: number;
	text: string;
	currentUser: string;
	contact: string;
	startDate: Date;
	endDate: Date;
};

const WorkerDialog = ({ worker, workerAttributes }: Props) => {
	const { data } = useQuery({
		queryKey: ['timeEntries'],
		queryFn: () =>
			getTimeEntries({
				conditions: { 'member/id': 310 },
				orderBy: { key: 'dateEntered', order: 'desc' },
			}),
	});

	const { data: activities } = useQuery({
		queryKey: ['activities'],
		queryFn: () =>
			getActivities({
				conditions: {
					'assignTo/id': 310,
					'type/id': 27,
				},
				// @ts-ignore
				orderBy: { key: 'dateEntered', order: 'desc' },
			}),
	});

	let logs: Log[] = [
		...(activities?.map(({ id, assignedBy, dateStart, dateEnd, contact }) => ({
			id,
			currentUser: assignedBy.name,
			contact: contact?.name ?? '',
			endDate: new Date(dateEnd),
			startDate: new Date(dateStart),
			text: `talked to`,
		})) ?? []),
		...(data?.map(({ id, member, timeStart, timeEnd, ticket }) => ({
			id,
			currentUser: member.name,
			contact: ticket?.summary ?? '',
			startDate: new Date(timeStart),
			endDate: new Date(timeEnd),
			text: 'saved a time entry to',
		})) ?? []),
	];

	const groupedLogs = groupBy(
		logs.sort((a, b) => b.endDate.getTime() - a.endDate.getTime()),
		({ startDate }) => Intl.DateTimeFormat('en-US', { dateStyle: 'short' }).format(new Date(startDate))
	);

	return (
		<DialogContent className='sm:max-w-5xl'>
			<DialogHeader className='flex flex-row items-center justify-start gap-3 space-y-0'>
				<Avatar className='h-12 w-12'>
					<AvatarFallback className='uppercase'>
						{worker.friendlyName[0]}
						{worker.friendlyName[1]}
					</AvatarFallback>
					{/* <AvatarImage src='https://cdn.prod.website-files.com/61d87d426829a9bac65eeb9e/654d2b113b66e71152acc84c_Nick_Headshot_Fall2023-p-500.jpg' /> */}
				</Avatar>

				<div className='space-y-1.5'>
					<DialogTitle>{workerAttributes.full_name}</DialogTitle>
					<DialogDescription>{workerAttributes.full_name}</DialogDescription>
				</div>
			</DialogHeader>

			<ScrollArea className='h-96'>
				<div className='grid grid-cols-4 gap-3'>
					<Card>
						<CardHeader>
							<CardTitle className='text-lg'>Outbound Conversations</CardTitle>
						</CardHeader>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className='text-lg'>Inbound Conversations</CardTitle>
						</CardHeader>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className='text-lg'>Inbound Missed</CardTitle>
						</CardHeader>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className='text-lg'>Total Time On Phone</CardTitle>
						</CardHeader>
					</Card>
				</div>

				{Object?.entries(groupedLogs).map(([key, logGroup], index) => (
					<Fragment key={key}>
						<h2 className='text-lg font-medium mb-3'>{key}</h2>

						{logGroup.map((log) => (
							<div
								key={`log-${log.id}`}
								className='px-1.5 flex items-start gap-3'
							>
								<div className='flex flex-col justify-center items-center'>
									<Avatar className='h-9 w-9'>
										<AvatarFallback>NB</AvatarFallback>
										<AvatarImage src='https://cdn.prod.website-files.com/61d87d426829a9bac65eeb9e/654d2b113b66e71152acc84c_Nick_Headshot_Fall2023-p-500.jpg' />
									</Avatar>

									<Separator
										orientation='vertical'
										className='min-h-9 w-[2px]'
									/>
								</div>

								<div className='space-y-1.5'>
									<p>
										<span className='font-medium'>{log.currentUser}</span>
										<span className='text-muted-foreground text-sm'> {log.text} </span>
										<span className='font-medium'>{log.contact}</span>
									</p>

									<p className='text-xs text-muted-foreground'>
										{formatDate({ timeStyle: 'short' }).formatRange(log.startDate, log.endDate)}
									</p>
								</div>
							</div>
						))}
					</Fragment>
					// {
					// 	logGroup.map(log => (
					// 	<span></span>
					// ))}
				))}
			</ScrollArea>
		</DialogContent>
	);
};

export default WorkerDialog;
