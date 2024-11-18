import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Building, Cable, Tag } from 'lucide-react';
import TicketList from '@/components/lists/ticket-list';
import { cn } from '@/lib/utils';
import ConfigurationsList from '@/components/lists/configurations-list';
import {
	getBoards,
	getCompanies,
	getCompanyNotes,
	getConfigurationStatuses,
	getConfigurationTypes,
	getContacts,
	getPriorities,
	getSystemMembers,
} from '@/lib/manage/read';
import CompanyOverviewTab from './company-overview-tab';

type Props = {
	contactId: number;
	companyId: number;
	className?: string;
};

const DashboardOverview = async ({ contactId, companyId, className }: Props) => {
	const [
		boards,
		priorities,
		members,
		{ data: companies },
		{ data: configurationStatuses },
		configurationTypes,
		{ data: contacts },
		{ data: notes },
	] = await Promise.all([
		getBoards({
			conditions: {
				inactiveFlag: false,
				projectFlag: false,
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
		getCompanyNotes(companyId, {
			conditions: {
				'type/id': 6,
			},
			fields: ['id', 'text', '_info'],
		}),
	]);

	const tabs = [
		{ name: 'Company', icon: Building },
		{ name: 'Configurations', icon: Cable },
		{ name: 'Tickets', icon: Tag },
	];

	return (
		<div className={cn('overflow-x-hidden', className)}>
			<Tabs defaultValue={tabs[2].name}>
				<TabsList>
					{tabs.map((tab) => (
						<TabsTrigger
							key={tab.name}
							className='w-full'
							value={tab.name}
						>
							<tab.icon className='mr-1.5' /> {tab.name}
						</TabsTrigger>
					))}
				</TabsList>

				<CompanyOverviewTab companyId={companyId} />

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
								closedFlag: false,
								'company/id': companyId ? [companyId] : undefined,
								'contact/id': contactId ? [contactId] : undefined,
								parentTicketId: null,
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

export default DashboardOverview;
