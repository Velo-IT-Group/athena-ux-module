import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Activity, Building, Cable, PhoneIncoming, PhoneOutgoing, Tag } from 'lucide-react';
import TicketList from '@/components/lists/ticket-list';
import { getAllCalls } from '@/lib/twilio/read';
import { CommunicationItem } from '@/types/manage';
import { cn, parsePhoneNumber } from '@/lib/utils';
import { CallInstance } from 'twilio/lib/rest/api/v2010/account/call';
import ActivityList from '@/components/lists/activity-list';
import { ReactNode, Suspense } from 'react';
import TableSkeleton from '@/components/ui/data-table/skeleton';
import ConfigurationsList from '@/components/lists/configurations-list';
import { groupBy } from 'lodash';
import { relativeDate } from '@/utils/date';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getBoards, getPriorities, getSystemMembers } from '@/lib/manage/read';
import { createClient } from '@/utils/supabase/server';

type Props = {
	contactId?: number;
	companyId?: number;
	className?: string;
	communicationItems?: CommunicationItem[];
};

const ConversationDetails = async ({ contactId: userId, companyId, className, communicationItems }: Props) => {
	const supabase = createClient();
	const [
		{
			data: { session },
		},
		boards,
		priorities,
		members,
	] = await Promise.all([
		supabase.auth.getSession(),
		getBoards({
			conditions: [
				{ parameter: { inactiveFlag: false } },
				{ parameter: { projectFlag: false } },
				{ parameter: { 'workRole/id': ' (9, 5)' }, comparator: 'in' },
			],
			orderBy: { key: 'name' },
			fields: ['id', 'name'],
			pageSize: 1000,
		}),
		getPriorities({ fields: ['id', 'name'], orderBy: { key: 'name' }, pageSize: 1000 }),
		getSystemMembers({
			conditions: [{ parameter: { inactiveFlag: false } }],
			fields: ['id', 'firstName', 'lastName'],
			orderBy: { key: 'firstName' },
			pageSize: 1000,
		}),
	]);

	const [calls] = await Promise.all(
		communicationItems?.length
			? communicationItems
					?.filter((item) => item.communicationType === 'Phone' && parsePhoneNumber(item.value).isValid)
					.map((item) => getAllCalls(item.value))
			: []
	);

	const groupedCalls = groupBy(
		calls?.sort((a, b) => {
			if (a.dateUpdated.getTime() < b.dateUpdated.getTime()) return 1;
			if (a.dateUpdated.getTime() > b.dateUpdated.getTime()) return -1;
			return 0;
		}),
		({ endTime }) => relativeDate(endTime)
	);

	const tabs: string[] = ['<,></', 'Company', 'Configurations', 'Tickets'];

	return (
		<div className={cn('w-full overflow-x-hidden', className)}>
			<Tabs defaultValue={tabs[3]}>
				<TabsList className='w-full'>
					<TabsTrigger
						className='w-full'
						value='Activity'
					>
						<Activity className='mr-1.5' /> Activity
					</TabsTrigger>

					<TabsTrigger
						className='w-full'
						value='Company'
					>
						<Building className='mr-1.5' /> Company
					</TabsTrigger>

					<TabsTrigger
						className='w-full'
						value='Configurations'
					>
						<Cable className='mr-1.5' /> Configurations
					</TabsTrigger>

					<TabsTrigger
						className='w-full'
						value='Tickets'
					>
						<Tag className='mr-1.5' /> Tickets
					</TabsTrigger>
				</TabsList>

				<TabsContent value='Activity'>
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
									// { parameter: { closedFlag: false } },
								],
								fields: ['id', 'summary', 'board', 'status', 'priority', 'owner', 'contact'],
								pageSize: 1000,
							}}
							facetedFilters={[
								{ accessoryKey: 'board', items: boards },
								{ accessoryKey: 'priority', items: priorities },
								{
									accessoryKey: 'owner',
									items: members.map((member) => {
										return { id: member.id, name: `${member.firstName} ${member.lastName ?? ''}` };
									}),
								},
							]}
						/>
					</Suspense>
				</TabsContent>

				<TabsContent value={tabs[2]}>
					<ConfigurationsList
						type='table'
						params={{
							// conditions: userId ? [{ parameter: { 'contact/id': userId } }] : [],
							conditions: [{ parameter: { 'company/id': 250 } }],
							fields: ['id', 'name', 'site', 'company', 'status', 'contact', 'deviceIdentifier'],
						}}
					/>
				</TabsContent>

				<TabsContent value={tabs[3]}>
					<Suspense fallback={<TableSkeleton />}>
						<TicketList
							type='table'
							params={{
								conditions: userId ? [{ parameter: { 'contact/id': userId } }] : [],
								fields: ['id', 'summary', 'board', 'status', 'priority', 'owner', 'contact'],
								pageSize: 1000,
							}}
							facetedFilters={[
								{ accessoryKey: 'board', items: boards },
								{ accessoryKey: 'priority', items: priorities },
								{
									accessoryKey: 'owner',
									items: members.map((member) => {
										return { id: member.id, name: `${member.firstName} ${member.lastName ?? ''}` };
									}),
								},
							]}
						/>
					</Suspense>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default ConversationDetails;
