import TicketList from '@/components/lists/ticket-list';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TableSkeleton from '@/components/ui/data-table/skeleton';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { linksConfig } from '@/config/links';
import { getBoards, getContact, getPriorities, getSystemMembers } from '@/lib/manage/read';
import { NavItemWithChildren } from '@/types/nav';
import { Building2, Cable, Download, Mail, MapPin, Phone, Plus, SquareArrowDown, Tag, Timer } from 'lucide-react';
import React, { Suspense } from 'react';
import parsePhoneNumber from 'libphonenumber-js';

type Props = {
	params: { id: number };
};

const Page = async ({ params }: Props) => {
	const [contact, boards, priorities, members] = await Promise.all([
		getContact(params.id),
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

	const details: NavItemWithChildren[] = [
		{
			title: 'Phone Number',
			icon: Phone,
			items:
				contact?.communicationItems
					?.filter((item) => item.communicationType === 'Phone')
					.map((item) => {
						const number = parsePhoneNumber(item.value ?? '', 'US');

						return { title: number?.format('NATIONAL') ?? '', items: [] };
					}) ?? [],
			addAction: true,
		},
		{
			title: 'Email',
			icon: Mail,
			items:
				contact?.communicationItems
					?.filter((item) => item.communicationType === 'Email')
					.map((item) => {
						return { title: item.value, items: [] };
					}) ?? [],
			addAction: true,
		},
		{
			title: 'Location',
			icon: MapPin,
			items: [],
		},
		{
			title: 'Response Time',
			icon: Timer,
			items: [],
		},
		{
			title: 'Organization',
			icon: Building2,
			items: [{ title: contact?.company?.name ?? '', items: [] }],
			addAction: true,
		},
	];

	return (
		<main className='grid p-3'>
			<header className='flex items-center justify-end'>
				<div>
					<Button>Add new ticket</Button>
				</div>
			</header>

			<section className='flex item-center gap-3'>
				<Avatar className='h-16 w-16'>
					<AvatarFallback className='text-2xl font-semibold'>
						{contact?.firstName?.[0]}
						{contact?.lastName?.[0]}
					</AvatarFallback>
				</Avatar>

				<div>
					<h1>
						{contact?.firstName} {contact?.lastName}
					</h1>

					<p>{contact?.company?.name}</p>
				</div>
			</section>

			<section className='grid grid-cols-[240px_1fr] gap-3'>
				<div className='flex flex-col gap-6'>
					<h3>Customer Details</h3>

					{details.map((detail) => (
						<section
							key={detail.title}
							className='space-y-3'
						>
							<h4 className='text-xs text-muted-foreground flex items-center'>
								{detail.icon && <detail.icon className='mr-1.5 inline-block' />} {detail.title}
								{detail.addAction && (
									<Button
										variant='ghost'
										size='smIcon'
										className='ml-auto'
									>
										<Plus />
									</Button>
								)}
							</h4>

							<div className='flex flex-col items-start gap-1.5'>
								{detail.items.map((item) => (
									<Badge>{item.title}</Badge>
								))}
							</div>
						</section>
					))}
				</div>

				<div>
					<Tabs defaultValue='tickets'>
						<TabsList>
							<TabsTrigger value='tickets'>
								<Tag className='mr-1.5' /> Tickets
							</TabsTrigger>

							<TabsTrigger value='configurations'>
								<Cable className='mr-1.5' /> Configurations
							</TabsTrigger>
						</TabsList>

						<TabsContent value='tickets'>
							<Suspense fallback={<TableSkeleton />}>
								<TicketList
									type='table'
									params={{
										conditions: [{ parameter: { 'contact/id': params.id } }],
										fields: ['id', 'summary', 'board', 'status', 'priority', 'owner', 'contact'],
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
			</section>
		</main>
	);
};

export default Page;
