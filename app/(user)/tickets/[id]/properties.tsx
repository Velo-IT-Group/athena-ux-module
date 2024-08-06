'use client';
import DatePicker from '@/components/ui/date-picker';
import { Separator } from '@/components/ui/separator';
import { Circle, CircleDashed, CircleUser } from 'lucide-react';
import React, { Suspense } from 'react';
import {
	Board,
	BoardStatus,
	Company,
	Contact,
	Priority,
	ReferenceType,
	ServiceTicket,
	SystemMember,
} from '@/types/manage';
import BoardSelector from './board-selector';
import { Skeleton } from '@/components/ui/skeleton';
import CompanySelector from './company-selector';
import ContactSelector from './contact-selector';
import { getBoards, getCompanies, getContacts, getPriorities, getStatuses, getSystemMembers } from '@/lib/manage/read';
import AsyncSelector, { Identifiable } from '@/components/async-selector';
import { updateTicket } from '@/lib/manage/update';
import { toast } from 'sonner';

export default function Properties({ ticket }: { ticket: ServiceTicket }) {
	// const attachments = await getDocuments('Ticket', ticket.id);

	const fetchMembers = async () => {
		const members = await getSystemMembers({
			orderBy: { key: 'firstName' },
			conditions: [{ parameter: { inactiveFlag: false } }],
			pageSize: 1000,
		});

		return members.map((member) => {
			return { ...member, name: `${member.firstName} ${member.lastName}` };
		});
	};

	return (
		<div className='pl-3 pb-6 pt-2.5 pr-1.5 space-y-7'>
			<section>
				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<AsyncSelector
						icon={<CircleDashed className='mr-1.5' />}
						fetchFunction={getStatuses(ticket.board!.id!, { orderBy: { key: 'name' } })}
						placeholder=''
						prompt=''
						updateFunction={async (arg) => {}}
						defaultValue={ticket.board as BoardStatus}
					/>
				</Suspense>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<AsyncSelector
						icon={
							<Circle
								className='mr-1.5'
								style={{ color: ticket.priority?.color?.toLowerCase() }}
							/>
						}
						fetchFunction={getPriorities({ orderBy: { key: 'sortOrder' } })}
						placeholder=''
						prompt=''
						updateFunction={async (arg) => {}}
						defaultValue={ticket.priority as Priority}
					/>
				</Suspense>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<AsyncSelector
						icon={<CircleUser className='mr-1.5' />}
						fetchFunction={fetchMembers()}
						placeholder=''
						prompt=''
						updateFunction={async (arg) => {}}
						defaultValue={ticket.owner}
					/>
				</Suspense>
			</section>

			<section>
				<h4 className='text-xs text-muted-foreground font-medium px-3'>Board</h4>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<AsyncSelector
						icon={<CircleUser className='mr-1.5' />}
						fetchFunction={getBoards({ orderBy: { key: 'name' }, pageSize: 1000 })}
						placeholder=''
						prompt=''
						updateFunction={async (e) => {
							try {
								await updateTicket(ticket.id, [{ op: 'replace', path: 'board/id', value: e.id }]);
							} catch (error) {
								toast.error(error as string);
							}
						}}
						defaultValue={ticket.board as Board}
					/>
				</Suspense>
			</section>

			<section>
				<h4 className='text-xs text-muted-foreground font-medium px-3'>Company</h4>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<AsyncSelector
						icon={<CircleUser className='mr-1.5' />}
						fetchFunction={getCompanies({
							conditions: [{ parameter: { 'status/id': 1 } }],
							childConditions: [{ parameter: { 'types/id': 1 } }],
							orderBy: { key: 'name' },
							pageSize: 1000,
						})}
						placeholder=''
						prompt=''
						updateFunction={async (e) => {
							try {
								await updateTicket(ticket.id, [{ op: 'replace', path: 'board/id', value: e.id }]);
							} catch (error) {
								toast.error(error as string);
							}
						}}
						defaultValue={ticket.company as Company}
					/>
				</Suspense>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<AsyncSelector
						icon={<CircleUser className='mr-1.5' />}
						fetchFunction={getContacts({
							conditions: [{ parameter: { 'company/id': ticket.company?.id! } }],
							pageSize: 1000,
							orderBy: { key: 'firstName' },
						})}
						placeholder=''
						prompt=''
						updateFunction={async (e) => {
							try {
								await updateTicket(ticket.id, [{ op: 'replace', path: 'board/id', value: e.id }]);
							} catch (error) {
								toast.error(error as string);
							}
						}}
						defaultValue={ticket.company as Contact}
					/>
					{/* <ContactSelector
						company={ticket.company}
						contact={ticket.contact}
					/> */}
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
