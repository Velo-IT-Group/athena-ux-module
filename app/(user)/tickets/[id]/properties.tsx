'use server';
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
import {
	getCompanySites,
	getContacts,
	getPriorities,
	getTicketConfigurations,
} from '@/lib/manage/read';
import BoardStatusList from '@/components/lists/board-status-list';
import BoardTypeList from '@/components/lists/board-type-list';
import BoardSubTypeList from '@/components/lists/board-sub-type-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import DataCombobox from '@/components/data-combox';
import { baseHeaders, userHeaders } from '@/lib/utils';
import { updateTicket } from '@/lib/manage/update';

export default async function Properties({
	ticket,
}: {
	ticket: ServiceTicket;
}) {
	const priorities = await getPriorities();
	// const [configurations, sites, contacts] = await Promise.all([
	// 	getTicketConfigurations(ticket.id),
	// 	getCompanySites(ticket.company?.id!, {
	// 		pageSize: 1000,
	// 		orderBy: { key: 'name' },
	// 	}),
	// 	getContacts({
	// 		conditions: { 'company/id': ticket.company?.id },
	// 		pageSize: 1000,
	// 		orderBy: { key: 'firstName' },
	// 	}),
	// ]);

	const priorityFunc = (id) =>
		updateTicket(ticket.id, [
			{ op: 'replace', path: '/priority/id', value: id },
		]);

	return (
		<div className="pb-6 pt-2.5 pr-1.5 space-y-6 min-h-[calc(100vh-49px)]">
			<section className="px-3">
				<DataCombobox
					popoverProps={{ side: 'bottom', align: 'start' }}
					defaultItems={priorities}
					// queryFn={async () => {
					// 	let reponse = await fetch(
					// 		'https://manage.velomethod.com/v4_6_release/apis/3.0/service/priorities',
					// 		{
					// 			headers: baseHeaders,
					// 			mode: 'no-cors',
					// 		}
					// 	);
					// 	return reponse.json();
					// }}
					mutationFn={priorityFunc}
				/>
				{/* <Suspense fallback={<Skeleton className="w-full h-9" />}>
					<PriorityList
						ticketId={ticket.id}
						type="combobox"
						defaultValue={ticket.priority}
						params={{
							fields: ['id', 'name'],
							orderBy: { key: 'name' },
							pageSize: 1000,
						}}
					/>
				</Suspense> */}

				{/* <Suspense fallback={<Skeleton className="w-full h-9" />}>
					<MemberList
						id={ticket.id}
						path="owner/id"
						type="combobox"
						defaultValue={ticket.owner}
					/>
				</Suspense> */}
			</section>

			{/* <Separator />

			<section className="px-3">
				<h4 className="text-xs text-muted-foreground font-medium px-3">
					Board
				</h4>

				<Suspense fallback={<Skeleton className="w-full h-9" />}>
					<BoardList
						ticketId={ticket.id}
						type="combobox"
						defaultValue={ticket.board}
						params={{
							conditions: {
								inactiveFlag: false,
								projectFlag: false,
								'workRole/id': [9, 5],
							},
							orderBy: { key: 'name' },
							fields: ['id', 'name'],
						}}
					/>
				</Suspense>

				<Suspense fallback={<Skeleton className="w-full h-9" />}>
					{ticket.board ? (
						<BoardStatusList
							id={ticket.board.id}
							type="combobox"
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

				<Suspense fallback={<Skeleton className="w-full h-9" />}>
					{ticket.board ? (
						<BoardTypeList
							ticketId={ticket.id}
							boardId={ticket.board.id}
							type="combobox"
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

				<Suspense fallback={<Skeleton className="w-full h-9" />}>
					{ticket.board ? (
						<BoardSubTypeList
							ticketId={ticket.id}
							boardId={ticket.board.id}
							type="combobox"
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

			<section className="px-3">
				<h4 className="text-xs text-muted-foreground font-medium px-3">
					Company
				</h4>

				<Suspense fallback={<Skeleton className="w-full h-9" />}>
					<CompanyList
						id={ticket.id}
						path="company/id"
						type="combobox"
						defaultValue={ticket.company}
					/>
				</Suspense>

				<Suspense fallback={<Skeleton className="w-full h-9" />}>
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

				<Suspense fallback={<Skeleton className="w-full h-9" />}>
					<ContactList
						type="combobox"
						defaultValue={ticket.contact?.id}
						definition={{ page: 'tickets' }}
						params={{
							conditions: {
								'company/id': ticket.company?.id,
								inactiveFlag: false,
							},
							childConditions: { 'types/id': 17 },
							pageSize: 1000,
							orderBy: { key: 'firstName' },
							fields: ['id', 'firstName', 'lastName'],
						}}
					/>
				</Suspense>
			</section>

			<Separator />

			<section className="group px-3">
				<div className="flex items-center justify-between gap-3">
					<h4 className="text-xs text-muted-foreground font-medium px-3">
						Configuration
					</h4>

					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant="ghost"
								size="smIcon"
								className="group-hover:opacity-100 opacity-0 transition-opacity">
								<Plus />
							</Button>
						</DialogTrigger>

						<DialogContent className="max-w-none sm:max-w-none w-[calc(100vw-24px)] h-[calc(100vh-24px)] flex flex-col py-[3rem]">
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

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<ConfigurationsList
						id={ticket.id}
						type='combobox'
						defaultValue={configurations}
					/>
				</Suspense>
			</section>

			<Separator />

			<section className="px-3">
				<h4 className="text-xs text-muted-foreground font-medium px-3">
					Due Date
				</h4>

				<DatePicker
					date={
						ticket?.requiredDate
							? new Date(ticket?.requiredDate)
							: new Date()
					}
				/>
			</section>

			<Separator />

			<section className="px-3">
				<h4 className="text-xs text-muted-foreground font-medium px-3">
					Estimated Start Date
				</h4>

				<DatePicker
					date={
						ticket?.estimatedStartDate
							? new Date(ticket?.estimatedStartDate)
							: new Date()
					}
				/>
			</section>

			<Separator />

			<section className="px-3">
				<h4 className="text-xs text-muted-foreground font-medium px-3">
					Attachments
				</h4>

				{attachments
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
					))}
			</section> */}
		</div>
	);
}
