'use client';
import React, { Fragment } from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useQueries } from '@tanstack/react-query';
import { getTimeEntries } from '@/lib/manage/read';
import { ScrollArea } from './ui/scroll-area';
import { formatDate, relativeDate, relativeDay } from '@/utils/date';
import { Separator } from './ui/separator';
import { groupBy } from 'lodash';
import { Worker } from 'twilio-taskrouter';
import { createClient } from '@/utils/supabase/client';
import { parsePhoneNumber } from '@/lib/utils';
import { Clock, LucideIcon, PhoneIncoming, PhoneOutgoing } from 'lucide-react';
import { SyncMapItem } from 'twilio-sync';
import { useWorker } from '@/providers/worker-provider';

type Props = {
	worker: Worker;
	workerAttributes: Record<string, any>;
	items: SyncMapItem[];
};

type Log = {
	id: number | string;
	text: string;
	currentUser: string;
	contact: string;
	startDate: Date;
	endDate: Date;
	icon: LucideIcon;
};

const WorkerDialog = ({ worker, workerAttributes, items }: Props) => {
	const {worker: currentWorker} = useWorker()
	const supabase = createClient()
	console.log(worker)

	const [{ data }, { data: conversationsData }] = useQueries({
		queries: [
			{
				queryKey: [
					'timeEntries',
					{
						conditions: { 
							'member/id': workerAttributes.member_id
						},
						orderBy: { key: 'dateEntered', order: 'desc' },
					}
				],
				queryFn: () =>
					getTimeEntries(
						{
						conditions: { 'member/id': workerAttributes.member_id },
						orderBy: { key: 'dateEntered', order: 'desc' },
					}
				),
			},
			{
				queryKey: ['conversations', worker.sid],
				queryFn: async () =>
					await supabase
						.schema('reporting')
						.from('conversations')
						.select()
						.eq('agent', worker.sid)
						.order('date', { ascending: false })
						.limit(25),
			}
		]
	})

	const conversations = conversationsData?.data;
	
	let logs: Log[] = [
		...(data?.filter(a => a.ticket !== undefined)?.map(({ id, member, timeStart, timeEnd, ticket }) => ({
			id,
			currentUser: member.name,
			contact: `#${ticket?.id ?? ''} - ${ticket?.summary ?? ''}`,
			startDate: new Date(timeStart),
			endDate: new Date(timeEnd),
			text: 'saved a time entry to',
			icon: Clock
		})) ?? []),
		...(conversations?.map(({id, date, phone_number, direction, talk_time}) => {
			const startDate = new Date(date);
			const endDate = new Date(startDate.getTime() + (talk_time ?? 0) * 1000); // Add duration in milliseconds
			const isInbound = direction === 'inbound'
			return {
				id,
				currentUser: worker.attributes.full_name,
				contact: parsePhoneNumber(phone_number ?? '')?.formattedNumber ?? '',
				startDate,
				endDate,
				text: isInbound ? 'talked to' : 'called',
				icon: isInbound ? PhoneIncoming : PhoneOutgoing
			}
		}
		)) ?? []
	];

	const groupedLogs = groupBy(
		logs.sort((a, b) => b.endDate.getTime() - a.endDate.getTime()),
		({ startDate }) => {
			let newDate = new Date(startDate)
			return relativeDay(newDate)}
	);

	return (
		<DialogContent className='sm:max-w-5xl'>
			<DialogHeader className='flex flex-row items-center justify-start gap-3 space-y-0'>
				<Avatar className='h-12 w-12 font-semibold'>
					<AvatarFallback className='uppercase'>
						{worker.friendlyName[0]}
						{worker.friendlyName[1]}
					</AvatarFallback>
				</Avatar>
				
				<div className='space-y-1.5'>
					<DialogTitle className='shrink-0'>{workerAttributes.full_name}</DialogTitle>
					{/* <div className='flex items-center gap-1.5'>
					</div> */}
					<DialogDescription>{workerAttributes.email}</DialogDescription>
				</div>
			</DialogHeader>

			<ScrollArea className='h-[480px]'>
				<div className='space-y-3 px-3'>
					{/* <p className='text-muted-foreground text-sm'>Activity Logs</p> */}

					<div>
						{Object?.entries(groupedLogs).map(([key, logGroup], index) => (
							<Fragment key={key}>
								<h2 className='font-medium mb-3 capitalize'>{key}</h2>

								{logGroup.map((log) => (
									<div
										key={`log-${log.id}`}
										className='group px-1.5 flex items-start gap-3'
									>
										<div className='flex flex-col justify-center items-center'>
											<Avatar className='h-9 w-9'>
												<AvatarFallback className='uppercase'>
													{/* <Icon  /> */}
													<log.icon />
												</AvatarFallback>
											</Avatar>

											<Separator
												orientation='vertical'
												className='min-h-9 w-[2px] group-last::opacity-0'
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
						))}
					</div>

				</div>
			</ScrollArea>
		</DialogContent>
	);
};

export default WorkerDialog;
