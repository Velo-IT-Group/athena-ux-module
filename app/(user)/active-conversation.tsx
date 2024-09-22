import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Activity, Building, Cable, PhoneIncoming, PhoneOutgoing, Tag } from 'lucide-react';
import TicketList from '@/components/lists/ticket-list';
import { getAllCalls } from '@/lib/twilio/read';
import { CommunicationItem, ServiceTicket } from '@/types/manage';
import { cn, parsePhoneNumber } from '@/lib/utils';
import { CallInstance } from 'twilio/lib/rest/api/v2010/account/call';
import ActivityList from '@/components/lists/activity-list';
import ConfigurationsList from '@/components/lists/configurations-list';
import { groupBy } from 'lodash';
import { relativeDate } from '@/utils/date';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
	getBoards,
	getCompanies,
	getConfigurations,
	getConfigurationStatuses,
	getConfigurationTypes,
	getPriorities,
	getSystemMembers,
	getTickets,
} from '@/lib/manage/read';
import { createClient } from '@/utils/supabase/server';
import { Conditions } from '@/utils/manage/params';
import getQueryClient from '../getQueryClient';

type Props = {
	contactId?: number;
	companyId?: number;
	className?: string;
	communicationItems?: CommunicationItem[];
	searchParams: { [key: string]: string | string[] | undefined };
	ticketFilter: Conditions<ServiceTicket>;
};

const ConversationDetails = async ({ contactId: userId, className, communicationItems, ticketFilter }: Props) => {
	const client = getQueryClient();
	const supabase = createClient();
	const [
		{
			data: { user },
		},
		boards,
		priorities,
		members,
		{ data: companies },
		{ data: configurationStatuses },
		configurationTypes,
	] = await Promise.all([
		supabase.auth.getUser(),
		getBoards({
			conditions: {
				inactiveFlag: false,
				projectFlag: false,
				'workRole/id': [9, 5],
			},
			orderBy: { key: 'name' },
			fields: ['id', 'name'],
			pageSize: 1000,
		}),
		getPriorities({ fields: ['id', 'name'], orderBy: { key: 'name' }, pageSize: 1000 }),
		getSystemMembers({
			conditions: { inactiveFlag: false },
			fields: ['id', 'firstName', 'lastName'],
			orderBy: { key: 'firstName' },
			pageSize: 1000,
		}),
		getCompanies({
			// conditions: { 'status/id': 1 },
			childConditions: { 'types/id': 1 },
			orderBy: { key: 'name', order: 'asc' },
			fields: ['id', 'name'],
			pageSize: 1000,
		}),
		getConfigurationStatuses({
			fields: ['id', 'description'],
			orderBy: {
				key: 'description',
			},
		}),
		getConfigurationTypes({
			orderBy: { key: 'name' },
			fields: ['id', 'name'],
			pageSize: 1000,
		}),
	]);

	const initalTickets = await client.fetchQuery({
		queryKey: ['tickets', ticketFilter],
		queryFn: ({ queryKey }) =>
			getTickets({
				...queryKey,
				page: ticketFilter.page ?? 1,
				conditions: {
					'board/id': boards.map((b) => b.id),
				},
				pageSize: ticketFilter.pageSize ?? 20,
				orderBy: { key: 'id', order: 'desc' },
				fields: ['id', 'summary', 'board', 'status', 'priority', 'owner', 'contact'],
			}),
	});

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

	const tabs = [
		{ name: 'Activity', icon: Activity },
		{ name: 'Company', icon: Building },
		{ name: 'Configurations', icon: Cable },
		{ name: 'Tickets', icon: Tag },
	];

	return (
		<div className={cn('w-full overflow-x-hidden', className)}>
			<Tabs defaultValue={tabs[2].name}>
				<TabsList className='w-full'>
					{tabs.map((tab) => (
						<TabsTrigger
							className='w-full'
							value={tab.name}
						>
							<tab.icon className='mr-1.5' /> {tab.name}
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value={tabs[0].name}>
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
														isInbound ? call.fromFormatted : user?.email === call.toFormatted ? 'You' : call.toFormatted
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

				<TabsContent value={tabs[1].name}>
					{/* <Suspense fallback={<TableSkeleton />}>
					</Suspense> */}
					{/* <TicketList
						type='table'
						defaultValue={initalConfigurations}
						facetedFilters={}
						// params={{
						// 	conditions: [
						// 		{ parameter: { summary: `'${searchParams['summary'] as string}'` }, comparator: 'contains' },
						// 		{ parameter: { 'company/id': companyId! } },
						// 		{ parameter: { 'contact/id': userId }, comparator: '!=' },
						// 		// { parameter: { closedFlag: false } },
						// 	],
						// 	fields: ['id', 'summary', 'board', 'status', 'priority', 'owner', 'contact'],
						// 	// pageSize: 1000,
						// }}
						// facetedFilters={[
						// 	{ accessoryKey: 'board', items: boards },
						// 	{ accessoryKey: 'priority', items: priorities },
						// 	{
						// 		accessoryKey: 'owner',
						// 		items: members.map((member) => {
						// 			return { id: member.id, name: `${member.firstName} ${member.lastName ?? ''}` };
						// 		}),
						// 	},
						// ]}
						definition={{ page: 'Dashboard', section: 'Company' }}
					/> */}
				</TabsContent>

				<TabsContent value={tabs[2].name}>
					<ConfigurationsList
						type='table'
						params={{
							// conditions: { 'company/id': 250 },
							fields: ['id', 'name', 'site', 'company', 'type', 'status', 'contact', 'deviceIdentifier'],
							orderBy: {
								key: 'name',
							},
						}}
						definition={{ page: 'Dashboard', section: 'Configurations' }}
						facetedFilters={[
							{ accessoryKey: 'company', items: companies },
							{
								accessoryKey: 'status',
								items: configurationStatuses.map(({ id, description }) => {
									return { id, name: description };
								}),
							},
							{ accessoryKey: 'type', items: configurationTypes },
						]}
					/>
				</TabsContent>

				<TabsContent value={tabs[3].name}>
					<TicketList
						type='table'
						params={{
							...ticketFilter,
							fields: ['id', 'summary', 'board', 'status', 'priority', 'owner', 'contact', 'company'],
							orderBy: { key: 'id', order: 'desc' },
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
							{
								accessoryKey: 'company',
								items: companies,
							},
						]}
						definition={{ page: 'Dashboard', section: 'Tickets' }}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default ConversationDetails;
