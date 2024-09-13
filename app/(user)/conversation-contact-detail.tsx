import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCommunicationTypes, getCompanies, getContact } from '@/lib/manage/read';
import { Building, ChevronsUpDown } from 'lucide-react';
import React, { Suspense } from 'react';
import { groupBy } from 'lodash';
import { Input } from '@/components/ui/input';
import LabeledInput from '@/components/ui/labeled-input';
import { Skeleton } from '@/components/ui/skeleton';
import ContactList from '@/components/lists/contact-list';
import ContactProfileForm from './contact-profile-form';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import TableSkeleton from '@/components/ui/data-table/skeleton';

type Props = {
	contactId?: number;
	companyId?: number;
	attributes: Record<string, any>;
};

const ConversationContactDetail = async ({ contactId, companyId, attributes }: Props) => {
	const [contact, types, { companies }] = await Promise.all([
		getContact(contactId ?? 32569),
		getCommunicationTypes(),
		getCompanies({
			conditions: [{ parameter: { 'status/id': 1 } }],
			childConditions: [{ parameter: { 'types/id': 1 } }],
			orderBy: { key: 'name', order: 'asc' },
			fields: ['id', 'name'],
			pageSize: 1000,
		}),
	]);

	const groupedCommunications = groupBy(contact?.communicationItems, 'communicationType');
	const isVip = contact?.types?.some((type) => type.name === 'VIP');

	return (
		<Suspense fallback={<Skeleton className='h-96 w-full' />}>
			<aside className='flex flex-col items-center gap-3 p-3 bg-background border-r'>
				<Avatar className='w-20 h-20'>
					<AvatarFallback className='text-2xl font-semibold'>
						{contact ? `${contact?.firstName?.[0]}${contact?.lastName?.[0]}` : 'UU'}
					</AvatarFallback>
					{/* <AvatarImage src='https://uploads-ssl.webflow.com/61d87d426829a9bac65eeb9e/654d2b113b66e71152acc84c_Nick_Headshot_Fall2023.jpg'></AvatarImage> */}
				</Avatar>

				<Dialog>
					<DialogTrigger asChild>
						<Button
							variant='ghost'
							size='sm'
							className=''
						>
							<h2 className='text-2xl font-semibold group flex items-center gap-1.5'>
								<span>
									{contact?.firstName} {contact?.lastName}
								</span>

								<ChevronsUpDown className='h-3.5 w-3.5 shrink-0' />
							</h2>
						</Button>
					</DialogTrigger>

					<DialogContent className='max-w-none sm:max-w-none w-[calc(100vw-24px)] h-[calc(100vh-24px)] flex flex-col py-[3rem]'>
						<Suspense fallback={<TableSkeleton />}>
							<ContactList
								type='table'
								id={1}
								path='contact/id'
								serviceType='ticket'
								params={{
									orderBy: { key: 'firstName' },
									conditions: [{ parameter: { inactiveFlag: false } }],
									childConditions: [{ parameter: { 'types/id': 17 } }, { parameter: { 'types/id': 21 } }],
									fields: ['id', 'firstName', 'lastName', 'company', 'communicationItems', 'defaultPhoneNbr'],
								}}
								facetedFilters={[{ accessoryKey: 'company', items: companies }]}
								columnDefs='homepage'
							/>
						</Suspense>
					</DialogContent>
				</Dialog>

				<div className='flex items-center gap-1.5 text-muted-foreground'>
					<Building />

					<span className='text-sm font-medium'>{contact?.company?.name}</span>

					{isVip && (
						<Badge
							variant='caution'
							className='rounded'
						>
							VIP
						</Badge>
					)}
				</div>

				<Tabs
					defaultValue='overview'
					className='w-full space-y-3'
				>
					<TabsList className='w-full'>
						<TabsTrigger
							className='w-full'
							value='overview'
						>
							Overview
						</TabsTrigger>

						<TabsTrigger
							className='w-full'
							value='profile'
						>
							Profile
						</TabsTrigger>
					</TabsList>

					<TabsContent
						value='overview'
						className='grid gap-3 px-1.5'
					>
						<LabeledInput
							label='Title'
							name='title'
							defaultValue={contact?.title}
						/>

						{Object.entries(groupedCommunications).map(([key, values]) => (
							<LabeledInput
								label={key}
								name={key}
								key={key}
							>
								{values.map(({ id, value, type }) => {
									return (
										<div
											key={id}
											className='grid grid-cols-[48px_1fr] items-start border border-input rounded-md overflow-hidden'
										>
											<div className='bg-muted/50 h-9 w-12 px-1.5 text-xs text-muted-foreground font-medium grid place-items-center border-r'>
												{type.name}
											</div>

											<Input
												name={key}
												defaultValue={value}
												className='h-9 w-full rounded-none border-0 px-1.5 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
											/>
										</div>
									);
								})}
							</LabeledInput>
						))}
					</TabsContent>

					<TabsContent
						value='profile'
						className='space-y-3 px-1.5'
					>
						<ContactProfileForm contact={contact} />
					</TabsContent>
				</Tabs>
			</aside>
		</Suspense>
	);
};

export default ConversationContactDetail;
