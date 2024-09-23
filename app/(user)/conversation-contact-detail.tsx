import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCommunicationTypes, getCompanies, getContact } from '@/lib/manage/read';
import { Building, ChevronsUpDown } from 'lucide-react';
import React, { Suspense } from 'react';
import { groupBy } from 'lodash';
import { Input } from '@/components/ui/input';
import LabeledInput from '@/components/ui/labeled-input';
import { Skeleton } from '@/components/ui/skeleton';
import ContactList from '@/components/lists/contact-list';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TableSkeleton from '@/components/ui/data-table/skeleton';
import { parsePhoneNumber } from '@/lib/utils';

type Props = {
	contactId?: number;
};

const ConversationContactDetail = async ({ contactId }: Props) => {
	const [contact, types, { data: companies }] = await Promise.all([
		getContact(contactId ?? 32569),
		getCommunicationTypes(),
		getCompanies({
			childConditions: { 'types/id': 1 },
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
						<DialogHeader>
							<DialogTitle>Contacts</DialogTitle>
						</DialogHeader>

						<Suspense
							fallback={
								<TableSkeleton
									rows={12}
									columns={12}
								/>
							}
						>
							<ContactList
								type='table'
								definition={{ page: 'Dashboard', section: 'contact-picker' }}
								params={{
									conditions: { inactiveFlag: false },
									childConditions: { 'types/id': 17 },
									orderBy: { key: 'firstName' },
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

				<div className='w-full space-y-3'>
					<h3 className='text-lg font-medium'>Overview</h3>

					<LabeledInput
						label='Title'
						name='title'
						value={contact?.title}
					/>

					{Object.entries(groupedCommunications).map(([key, values]) => (
						<LabeledInput
							label={key}
							name={key}
							key={key}
						>
							{values.map(({ id, value, type, communicationType }) => {
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
											readOnly
											defaultValue={
												communicationType && ['Phone', 'Fax'].includes(communicationType)
													? parsePhoneNumber(value).formattedNumber
													: value
											}
											className='h-9 w-full rounded-none border-0 px-1.5 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
										/>
									</div>
								);
							})}
						</LabeledInput>
					))}
				</div>
			</aside>
		</Suspense>
	);
};

export default ConversationContactDetail;
