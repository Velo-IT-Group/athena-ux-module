import React, { Suspense } from 'react';
import Properties from './properties';
import { getTicket, getTicketNotes } from '@/lib/manage/read';
import { Separator } from '@/components/ui/separator';
import ActivityFeed from './activity-feed';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import ParentTicket from '../(tickets)/parent-ticket';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import ChildTickets from './child-tickets';
import TicketSummary from './ticket-summary';

type Props = {
	params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
	const { id } = await params;
	const [ticket, notes] = await Promise.all([
		getTicket(Number(id)),
		getTicketNotes(Number(id)),
	]);

	const initalNote = notes.find((note) => note.detailDescriptionFlag);

	return (
		<main className="grid grid-cols-[1fr_280px] items-start gap-3 h-full grow bg-muted/15">
			<ScrollArea className="grid min-h-0 h-full overflow-y-auto">
				<div className="max-w-3xl w-full mx-auto py-10 grid items-start">
					{ticket.parentTicketId && (
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink
										href={`/tickets/${ticket.parentTicketId}`}>
										#{ticket.parentTicketId}
									</BreadcrumbLink>
								</BreadcrumbItem>

								<BreadcrumbSeparator />

								<BreadcrumbItem>
									<BreadcrumbLink href="/">
										{ticket.summary}
									</BreadcrumbLink>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					)}

					<TicketSummary
						id={Number(id)}
						summary={ticket.summary}
					/>
					{/* <Textarea
						name="summary"
						defaultValue={ticket.summary}
						className="border-none text-2xl font-semibold focus-visible:ring-0 shadow-none resize-none pointer-events-none"
						readOnly
					/> */}

					{ticket.parentTicketId && (
						<Suspense fallback={<Skeleton className="h-9 w-24" />}>
							<ParentTicket ticketId={ticket.parentTicketId} />
						</Suspense>
					)}

					<Textarea
						placeholder="Add a comment..."
						className="border-none shadow-none focus-visible:ring-0"
						defaultValue={initalNote?.text}
						// readOnly
						minRows={3}
					/>

					{ticket.hasChildTicket ? (
						<Suspense>
							<ChildTickets ticketId={ticket.id} />
						</Suspense>
					) : (
						<Separator />
					)}

					<ActivityFeed id={Number(id)} />
				</div>
			</ScrollArea>

			<div className="border-l h-full">
				<Properties ticket={ticket} />
			</div>
		</main>
	);
}
