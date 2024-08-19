import DatePicker from '@/components/ui/date-picker';
import { Separator } from '@/components/ui/separator';
import React, { Suspense } from 'react';
import { ServiceTicket } from '@/types/manage';
import { Skeleton } from '@/components/ui/skeleton';
import BoardList from '@/components/lists/board-list';
import ContactList from '@/components/lists/contact-list';
import MemberList from '@/components/lists/member-list';
import CompanyList from '@/components/lists/company-list';
import PriorityList from '@/components/lists/priority-list';
import ConfigurationsList from '@/components/lists/configurations-list';
import { getCompanySites, getContacts, getTicketConfigurations } from '@/lib/manage/read';
import BoardStatusList from '@/components/lists/board-status-list';
import BoardTypeList from '@/components/lists/board-type-list';
import BoardSubTypeList from '@/components/lists/board-sub-type-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import TableSkeleton from '@/components/ui/data-table/skeleton';
import SiteList from '@/components/lists/site-list';

export default async function Properties({ ticket }: { ticket: ServiceTicket }) {
	const [configurations, sites, contacts] = await Promise.all([
		getTicketConfigurations(ticket.id),
		getCompanySites(ticket.company?.id, { pageSize: 1000, orderBy: { key: 'name' } }),
		getContacts({
			conditions: [{ parameter: { 'company/id': ticket.company?.id } }],
			pageSize: 1000,
			orderBy: { key: 'firstName' },
		}),
	]);

	return (
		<div className='pb-6 pt-2.5 pr-1.5 space-y-6 min-h-[calc(100vh-49px)]'>
			<section className='px-3'>
				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<PriorityList
						ticketId={ticket.id}
						type='combobox'
						defaultValue={ticket.priority}
						params={{
							fields: ['id', 'name'],
							orderBy: { key: 'name' },
							pageSize: 1000,
						}}
					/>
				</Suspense>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<MemberList
						id={ticket.id}
						path='owner/id'
						type='combobox'
						defaultValue={ticket.owner}
					/>
				</Suspense>
			</section>

			<Separator />

			<section className='px-3'>
				<h4 className='text-xs text-muted-foreground font-medium px-3'>Board</h4>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<BoardList
						ticketId={ticket.id}
						type='combobox'
						defaultValue={ticket.board}
						params={{
							conditions: [
								{ parameter: { inactiveFlag: false } },
								{ parameter: { projectFlag: false } },
								{ parameter: { 'workRole/id': ' (9, 5)' }, comparator: 'in' },
							],
							orderBy: { key: 'name' },
							fields: ['id', 'name'],
						}}
					/>
				</Suspense>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					{ticket.board ? (
						<BoardStatusList
							id={ticket.board.id}
							type='combobox'
							defaultValue={ticket.status}
							params={{
								fields: ['id', 'name'],
								pageSize: 1000,
							}}
						/>
					) : (
						<></>
					)}
				</Suspense>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					{ticket.board ? (
						<BoardTypeList
							ticketId={ticket.id}
							boardId={ticket.board.id}
							type='combobox'
							defaultValue={ticket.type}
							params={{
								fields: ['id', 'name'],
								pageSize: 1000,
							}}
						/>
					) : (
						<></>
					)}
				</Suspense>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					{ticket.board ? (
						<BoardSubTypeList
							ticketId={ticket.id}
							boardId={ticket.board.id}
							type='combobox'
							defaultValue={ticket.subType}
							params={{
								fields: ['id', 'name'],
								pageSize: 1000,
							}}
						/>
					) : (
						<></>
					)}
				</Suspense>
			</section>

			<Separator />

			<section className='px-3'>
				<h4 className='text-xs text-muted-foreground font-medium px-3'>Company</h4>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<CompanyList
						id={ticket.id}
						path='company/id'
						type='combobox'
						defaultValue={ticket.company}
					/>
				</Suspense>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<SiteList
						id={ticket.id}
						companyId={ticket.company?.id}
						path='company/id'
						type='combobox'
						defaultValue={ticket.site}
						params={{
							fields: ['id', 'name'],
							pageSize: 1000,
							orderBy: { key: 'name' },
						}}
					/>
				</Suspense>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<ContactList
						id={ticket.id}
						path='contact/id'
						serviceType='ticket'
						type='combobox'
						defaultValue={ticket.contact}
						params={{
							conditions: [{ parameter: { 'company/id': ticket.company?.id } }, { parameter: { inactiveFlag: false } }],
							childConditions: [{ parameter: { 'types/id': 17 } }],
							pageSize: 1000,
							orderBy: { key: 'firstName' },
							fields: ['id', 'firstName', 'lastName'],
						}}
					/>
				</Suspense>
			</section>

			<Separator />

			<section className='group px-3'>
				<div className='flex items-center justify-between gap-3'>
					<h4 className='text-xs text-muted-foreground font-medium px-3'>Configuration</h4>

					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant='ghost'
								size='smIcon'
								className='group-hover:opacity-100 opacity-0 transition-opacity'
							>
								<Plus />
							</Button>
						</DialogTrigger>

						<DialogContent className='max-w-none sm:max-w-none w-[calc(100vw-24px)] h-[calc(100vh-24px)] flex flex-col py-[3rem]'>
							<Suspense fallback={<TableSkeleton />}>
								<ConfigurationsList
									id={ticket.id}
									type='table'
									defaultValue={configurations}
									params={{
										conditions: [
											{ parameter: { 'company/id': ticket.company?.id } },
											{ parameter: { activeFlag: true } },
										],
										orderBy: { key: 'name' },
										fields: ['id', 'name', 'site', 'company', 'status', 'contact', 'deviceIdentifier'],
									}}
									facetedFilters={[
										{ accessoryKey: 'site', items: sites },
										{
											accessoryKey: 'contact',
											items: contacts.map(({ id, firstName, lastName }) => {
												return { id, name: `${firstName} ${lastName ?? ''}` };
											}),
										},
									]}
								/>
							</Suspense>
						</DialogContent>
					</Dialog>
				</div>

				{/* <Suspense fallback={<Skeleton className='w-full h-9' />}>
					<ConfigurationsList
						id={ticket.id}
						type='combobox'
						defaultValue={configurations}
					/>
				</Suspense> */}
			</section>

			<Separator />

			<section className='px-3'>
				<h4 className='text-xs text-muted-foreground font-medium px-3'>Due Date</h4>

				<DatePicker date={ticket?.requiredDate ? new Date(ticket?.requiredDate) : new Date()} />
			</section>

			<Separator />

			<section className='px-3'>
				<h4 className='text-xs text-muted-foreground font-medium px-3'>Estimated Start Date</h4>

				<DatePicker date={ticket?.estimatedStartDate ? new Date(ticket?.estimatedStartDate) : new Date()} />
			</section>

			<Separator />

			<section className='px-3'>
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
