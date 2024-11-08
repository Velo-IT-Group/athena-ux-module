import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Box, Building, Cable, Tag } from 'lucide-react';
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
	getProjects,
	getSystemMembers,
} from '@/lib/manage/read';
import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import SOPExceptions from './sop-exceptions';

type Props = {
	contactId?: number;
	companyId?: number;
	className?: string;
};

const ConversationDetails = async ({ contactId, companyId, className }: Props) => {
	const supabase = await createClient();
	const [
		boards,
		priorities,
		members,
		{ data: companies },
		{ data: configurationStatuses },
		configurationTypes,
		{ data: projects },
		{ data: contacts },
		{ data: notes },
	] = await Promise.all([
		getBoards({
			conditions: {
				inactiveFlag: false,
				projectFlag: false,
				// 'workRole/id': [9, 5],
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
		getProjects({
			conditions: {
				closedFlag: false,
				'company/id': companyId,
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
				<TabsList className=''>
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

				<TabsContent
					value={tabs[0].name}
					className='grid grid-cols-[3fr_2fr] gap-3'
				>
					<div className='space-y-3'>
						<h2 className='text-xl font-bold tracking-tight'>SOP Exceptions</h2>
						<SOPExceptions
							note={notes?.[0]}
							companyId={companyId!}
						/>
					</div>

					<div className='space-y-3'>
						<h2 className='text-xl font-bold tracking-tight'>Active Projects</h2>
						{projects.length === 0 && (
							<div className='max-h-60 grid place-items-center h-full text-muted-foreground'>
								<div className='grid place-items-center gap-1.5'>
									<Box className='w-9 h-9' />
									<p className='text-lg text-center font-semibold'>No active projects</p>
								</div>
							</div>
						)}
						{projects.map((project) => (
							<Card key={project.id}>
								<CardHeader>
									<CardTitle className='text-base'>{project?.name}</CardTitle>
									<CardDescription className='text-sm'>
										<Textarea
											value={project?.description?.trim()}
											readOnly
											className='border-none px-0 focus-visible:ring-0 shadow-none'
										/>
									</CardDescription>
								</CardHeader>

								<CardContent className='space-y-3'>
									<Separator className='' />
								</CardContent>

								<CardFooter>
									<div className='grid gap-1.5 w-full'>
										<div className='grid gap-3'>
											<div className='flex items-center justify-between gap-1.5'>
												<Label>Status</Label>
												<Badge className='rounded-sm'>{project.status?.name}</Badge>
											</div>

											<Progress
												value={(project?.percentComplete ?? 0) * 100}
												max={100}
												className='w-full'
											/>
										</div>

										<div className='text-secondary-foreground text-xs'>
											{(project?.percentComplete ?? 0) * 100}% complete
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

export default ConversationDetails;
