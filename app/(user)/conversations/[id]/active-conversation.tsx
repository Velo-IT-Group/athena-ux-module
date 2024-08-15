import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PhoneIncoming, PhoneOutgoing } from 'lucide-react';
import TicketList from '@/components/lists/ticket-list';
import { getAllCalls } from '@/lib/twilio/read';
import { CommunicationItem } from '@/types/manage';
import { cn, parsePhoneNumber } from '@/lib/utils';
import { CallInstance } from 'twilio/lib/rest/api/v2010/account/call';
import { auth } from '@/auth';
import ActivityList from '@/components/lists/activity-list';
import { Suspense } from 'react';
import TableSkeleton from '@/components/ui/data-table/skeleton';
import ConfigurationsList from '@/components/lists/configurations-list';
import { groupBy } from 'lodash';
import { relativeDate } from '@/utils/date';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type Props = {
	contactId?: number;
	companyId?: number;
	className?: string;
	communicationItems?: CommunicationItem[];
};

const ConversationDetails = async ({ contactId: userId, companyId, className, communicationItems }: Props) => {
	const session = auth();

	const [calls] = await Promise.all(
		communicationItems?.length
			? communicationItems
					?.filter((item) => item.communicationType === 'Phone' && parsePhoneNumber(item.value).isValid)
					.map((item) => getAllCalls(item.value))
			: []
	);

	const groupedCalls = groupBy(
		calls.sort((a, b) => {
			if (a.dateUpdated.getTime() < b.dateUpdated.getTime()) return 1;
			if (a.dateUpdated.getTime() > b.dateUpdated.getTime()) return -1;
			return 0;
		}),
		({ endTime }) => relativeDate(endTime)
	);

	const tabs = ['Overview', 'Company', 'Configurations', 'Tickets'];

	return (
		<div className={cn('w-full overflow-x-hidden', className)}>
			<Tabs defaultValue={tabs[3]}>
				<TabsList className='w-full'>
					{tabs.map((tab) => (
						<TabsTrigger
							className='w-full'
							value={tab}
							key={tab}
						>
							{tab}
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value={tabs[0]}>
					<Accordion type='multiple'>
						{Object.entries(groupedCalls).map(([date, calls]) => (
							<AccordionItem value={date}>
								<AccordionTrigger>{date}</AccordionTrigger>
								<AccordionContent className='space-y-3 flex flex-col'>
									<ActivityList
										activities={(calls as CallInstance[])
											?.sort((a, b) => {
												if (a.dateUpdated.getTime() < b.dateUpdated.getTime()) return 1;
												if (a.dateUpdated.getTime() > b.dateUpdated.getTime()) return -1;
												return 0;
											})
											.map((call: CallInstance) => {
												const isInbound = call.direction === 'inbound';
												return {
													icon: isInbound ? PhoneIncoming : PhoneOutgoing,
													date: call.endTime,
													text: `${
														isInbound
															? call.fromFormatted
															: session?.user?.email === call.toFormatted
															? 'You'
															: call.toFormatted
													}
												called ${isInbound ? call.toFormatted : call.fromFormatted}`,
												};
											})}
									/>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</TabsContent>

				<TabsContent value={tabs[1]}>
					<Suspense fallback={<TableSkeleton />}>
						<TicketList
							type='table'
							params={{
								conditions: [
									{ parameter: { 'company/id': companyId! } },
									{ parameter: { 'contact/id': userId }, comparator: '!=' },
								],
								pageSize: 1000,
							}}
						/>
					</Suspense>
				</TabsContent>

				<TabsContent value={tabs[2]}>
					<ConfigurationsList
						type='table'
						params={{ conditions: userId ? [{ parameter: { 'contact/id': userId } }] : [] }}
					/>
				</TabsContent>

				<TabsContent value={tabs[3]}>
					<Suspense fallback={<TableSkeleton />}>
						<TicketList
							type='table'
							params={{ conditions: userId ? [{ parameter: { 'contact/id': userId } }] : [] }}
							hidePagination
						/>
					</Suspense>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default ConversationDetails;
