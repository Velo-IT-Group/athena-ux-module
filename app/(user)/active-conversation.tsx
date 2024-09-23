import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Activity, Building, Cable, PhoneIncoming, PhoneOutgoing, Tag } from 'lucide-react';
import TicketList from '@/components/lists/ticket-list';
import { cn } from '@/lib/utils';
import ActivityList from '@/components/lists/activity-list';
import ConfigurationsList from '@/components/lists/configurations-list';
import { groupBy } from 'lodash';
import { relativeDate } from '@/utils/date';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
	getBoards,
	getCompanies,
	getConfigurationStatuses,
	getConfigurationTypes,
	getContacts,
	getPriorities,
	getProjects,
	getSystemMembers,
} from '@/lib/manage/read';
import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import LabeledInput from '@/components/ui/labeled-input';

type Props = {
	contactId?: number;
	companyId?: number;
	className?: string;
};

const ConversationDetails = async ({ contactId, companyId, className }: Props) => {
	const supabase = createClient();
	const [
		boards,
		priorities,
		members,
		{ data: companies },
		{ data: configurationStatuses },
		configurationTypes,
		{ data: calls },
		{ data: projects },
		{ data: contacts },
	] = await Promise.all([
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
		supabase
			.schema('reporting')
			.from('conversations')
			.select()
			.eq('contact_id', contactId ? contactId : '')
			.eq('company_id', companyId ? companyId : ''),
		getProjects({
			conditions: {
				closedFlag: false,
			},
		}),
		getContacts({
			conditions: {
				'company/id': companyId ? [companyId] : undefined,
				inactiveFlag: false,
			},
			orderBy: {
				key: 'firstName',
			},
			fields: ['id', 'firstName', 'lastName'],
			pageSize: 1000,
		}),
	]);

	const tabs = [
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

				<TabsContent
					value={tabs[0].name}
					className='grid grid-cols-[2fr_1fr] gap-3'
				>
					<div>
						<h2 className='text-xl font-bold tracking-tight'>SOP Exceptions</h2>
					</div>

					<div className='space-y-3'>
						<h2 className='text-xl font-bold tracking-tight'>Active Projects</h2>
						{projects.map((project) => (
							<Card key={project.id}>
								<CardContent className='py-3 flex justify-end'>
									<Badge className='rounded-sm'>{project.status?.name}</Badge>
								</CardContent>

								<CardHeader className='pt-0 pb-1.5'>
									<CardTitle className='text-base'>{project?.name}</CardTitle>
									<CardDescription className='text-sm'>{project?.description}</CardDescription>
								</CardHeader>

								<Separator className='my-3' />

								<CardFooter>
									<div className='grid gap-1.5 w-full'>
										<LabeledInput
											label='Status'
											className='w-full'
										>
											<Progress
												value={(project?.percentComplete ?? 0) * 100}
												max={100}
												className='w-full'
											/>
										</LabeledInput>

										<div className='text-secondary-foreground text-xs'>
											{(project?.percentComplete ?? 0) * 100}% out of 100% complete
										</div>
									</div>
								</CardFooter>
							</Card>
						))}
					</div>
				</TabsContent>

				<TabsContent value={tabs[1].name}>
					<ConfigurationsList
						type='table'
						params={{
							conditions: {
								'company/id': companyId ? [companyId] : undefined,
								'contact/id': contactId ? [contactId] : undefined,
								'status/id': [2],
							},
							fields: ['id', 'name', 'site', 'company', 'type', 'status', 'contact', 'deviceIdentifier'],
							orderBy: {
								key: 'name',
							},
						}}
						definition={{ page: 'Dashboard', section: 'Configurations' }}
						// @ts-ignore
						facetedFilters={[
							{ accessoryKey: 'company', items: companies },
							{
								accessoryKey: 'status',
								items: configurationStatuses.map(({ id, description }) => {
									return { id, name: description };
								}),
							},
							companyId
								? {
										accessoryKey: 'contact',
										items: contacts.map((c) => {
											return { id: c.id, name: `${c.firstName} ${c.lastName ?? ''}` };
										}),
								  }
								: undefined,
							{ accessoryKey: 'type', items: configurationTypes },
						].filter(Boolean)}
					/>
				</TabsContent>

				<TabsContent value={tabs[2].name}>
					<TicketList
						type='table'
						params={{
							conditions: {
								'company/id': companyId ? [companyId] : undefined,
								'contact/id': contactId ? [contactId] : undefined,
							},
							fields: ['id', 'summary', 'board', 'status', 'priority', 'owner', 'contact', 'company'],
							orderBy: { key: 'id', order: 'desc' },
						}}
						// @ts-ignore
						facetedFilters={[
							{ accessoryKey: 'board', items: boards },
							{ accessoryKey: 'priority', items: priorities },
							{
								accessoryKey: 'owner',
								items: members.map((member) => {
									return { id: member.id, name: `${member.firstName} ${member.lastName ?? ''}` };
								}),
							},
							companyId
								? {
										accessoryKey: 'contact',
										items: contacts.map((c) => {
											return { id: c.id, name: `${c.firstName} ${c.lastName ?? ''}` };
										}),
								  }
								: undefined,
							{
								accessoryKey: 'company',
								items: companies,
							},
						].filter(Boolean)}
						definition={{ page: 'Dashboard', section: 'Tickets' }}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default ConversationDetails;
