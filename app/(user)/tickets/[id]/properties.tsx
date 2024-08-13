import DatePicker from '@/components/ui/date-picker';
import { Separator } from '@/components/ui/separator';
import React, { Suspense } from 'react';
import { ServiceTicket } from '@/types/manage';
import { Skeleton } from '@/components/ui/skeleton';
import BoardList from '@/components/board-list';
import ContactList from '@/components/contact-list';
import MemberList from '@/components/member-list';
import CompanyList from '@/components/company-list';
import PriorityList from '@/components/priority-list';
import ConfigurationsList from '@/components/configurations-list';
import { getConfigurations } from '@/lib/manage/read';

export default async function Properties({ ticket }: { ticket: ServiceTicket }) {
	const { configurations } = await getConfigurations();
	// const attachments = await getDocuments('Ticket', ticket.id);

	return (
		<div className='pl-3 pb-6 pt-2.5 pr-1.5 space-y-7'>
			<section>
				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<BoardList
						type='combobox'
						defaultValue={ticket.board}
					/>
				</Suspense>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<PriorityList
						type='combobox'
						defaultValue={ticket.priority}
					/>
				</Suspense>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<ContactList
						type='combobox'
						defaultValue={ticket.contact}
						params={{
							conditions: ticket.company
								? [{ parameter: { 'company/id': ticket.company.id } }, { parameter: { inactiveFlag: false } }]
								: [],
							childConditions: [{ parameter: { 'types/id': 17 } }],
							pageSize: 1000,
							orderBy: { key: 'firstName' },
						}}
					/>
				</Suspense>
			</section>

			<section>
				<h4 className='text-xs text-muted-foreground font-medium px-3'>Board</h4>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<BoardList
						type='combobox'
						defaultValue={ticket.board}
					/>
				</Suspense>
			</section>

			<section>
				<h4 className='text-xs text-muted-foreground font-medium px-3'>Company</h4>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<CompanyList
						type='combobox'
						defaultValue={ticket.company}
					/>
				</Suspense>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<MemberList
						type='combobox'
						defaultValue={ticket.owner}
					/>
				</Suspense>
			</section>

			<section>
				<h4 className='text-xs text-muted-foreground font-medium px-3'>Configuration</h4>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<ConfigurationsList
						type='combobox'
						defaultValue={[configurations[0], configurations[1]]}
					/>
				</Suspense>
			</section>

			<Separator />

			<section>
				<h4 className='text-xs text-muted-foreground font-medium px-3'>Due Date</h4>

				<DatePicker date={ticket?.requiredDate ? new Date(ticket?.requiredDate) : new Date()} />
			</section>

			<Separator />

			<section>
				<h4 className='text-xs text-muted-foreground font-medium px-3'>Attachments</h4>

				{/* {attachments
					?.filter((attachment) => attachment.documentType.id === 7)
					.map((attachment) => (
						<Tooltip>
							<TooltipTrigger>
								<div
									key={attachment.id}
									className='flex items-center gap-3'
								>
									<Paperclip />

									<span className='line-clamp-1'>{attachment.title}</span>
								</div>
							</TooltipTrigger>

							<TooltipContent>
								<audio controls>
									<source
										src={attachment.fileName}
										type='audio/ogg'
									/>
									<source
										src={attachment.fileName}
										type='audio/mpeg'
									/>
									Your browser does not support the audio element.
								</audio>
							</TooltipContent>
						</Tooltip>
					))} */}
			</section>
		</div>
	);
}
