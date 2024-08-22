import TicketList from '@/components/lists/ticket-list';
import PhoneNumberButton from '@/components/phone-number-button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import TableSkeleton from '@/components/ui/data-table/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getBoards, getContact, getPriorities, getSystemMembers } from '@/lib/manage/read';
import { NavItemWithChildren } from '@/types/nav';
import { Activity, Building2, Cable, Mail, MapPin, Phone, Plus, Tag, Timer } from 'lucide-react';
import React, { Suspense } from 'react';

type Props = {
	params: { id: number };
};

type NavItemWithAddAction = NavItemWithChildren & {
	title: string | React.ReactNode;
	addAction?: boolean;
	items: NavItemWithAddAction[];
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

	const details: NavItemWithAddAction[] = [
		{
			title: 'Phone Number',
			icon: Phone,
			items:
				contact?.communicationItems
					?.filter((item) => item.communicationType === 'Phone')
					.map((item) => {
						return {
							title: (
								<PhoneNumberButton
									phoneNumber={item.value}
									className='px-0'
								/>
							),
							items: [],
						};
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
			items: [{ title: contact?.site?.name ?? '', items: [] }],
			addAction: true,
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
		<main className='h-full p-3 space-y-3'>
			<header className='flex justify-between'>
				<div className='flex items-center gap-3'>
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
				</div>
				<div>
					<Button>Add new ticket</Button>
				</div>
			</header>

			<section className='grid grid-cols-[1fr_4fr] items-start gap-3'>
				<div className='grid items-start space-y-1.5'>
					<h3 className='text-sm text-muted-foreground'>Customer Details</h3>

					<div className='flex flex-col gap-6 bg-muted p-3 rounded-lg'>
						{details.map((detail) => (
							<section
								key={detail.title}
								className='space-y-3'
							>
								<h4 className='text-xs text-muted-foreground flex items-center group'>
									{detail.icon && <detail.icon className='mr-1.5 inline-block' />} {detail.title}
									{detail.addAction && (
										<Button
											variant='ghost'
											size='smIcon'
											className='ml-auto opacity-0 group-hover:opacity-100 transition-opacity'
										>
											<Plus />
										</Button>
									)}
								</h4>

								<div className='flex flex-col items-start gap-1.5'>
									{detail.items.map((item) => (
										<div key={item.title}>{item.title}</div>
									))}
								</div>
							</section>
						))}
					</div>
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

							<TabsTrigger value='activity'>
								<Activity className='mr-1.5' /> Activity
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
