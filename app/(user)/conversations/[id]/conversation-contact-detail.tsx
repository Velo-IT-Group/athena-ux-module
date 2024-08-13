import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCommunicationTypes, getContact, getContactCommunications, getContacts } from '@/lib/manage/read';
import { Building, Building2, Ellipsis, Laptop, Mail, Phone, Plus } from 'lucide-react';
import React, { Suspense } from 'react';
import ContactSelector from './contact-selector';
import { groupBy } from 'lodash';
import { Input } from '@/components/ui/input';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LabeledInput from '@/components/ui/labeled-input';
import DatePicker from '@/components/ui/date-picker';
import { Skeleton } from '@/components/ui/skeleton';
import ContactList from '@/components/contact-list';
import ContactProfileForm from '../contact-profile-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CommunicationItemForm from '@/components/forms/communication-item-form';

type Props = {
	contactId?: number;
	companyId?: number;
	attributes: Record<string, any>;
};

const ConversationContactDetail = async ({ contactId, companyId, attributes }: Props) => {
	const [contact, contacts, types] = await Promise.all([
		getContact(contactId ?? 0),
		getContacts({
			conditions: companyId ? [{ parameter: { 'company/id': companyId } }, { parameter: { inactiveFlag: false } }] : [],
			childConditions: [{ parameter: { 'types/id': 17 } }],
			pageSize: 1000,
			orderBy: { key: 'firstName' },
		}),
		getCommunicationTypes(),
	]);

	const groupedCommunications = groupBy(contact?.communicationItems, 'communicationType');
	const isVip = contact?.types?.some((type) => type.name === 'VIP');

	return (
		<Suspense fallback={<Skeleton className='h-96 w-full' />}>
			<aside className='flex flex-col items-center gap-3 p-3 bg-background border-r'>
				<Avatar className='w-20 h-20'>
					<AvatarFallback>{contactId ? `${contact?.firstName} ${contact?.lastName}` : 'UU'}</AvatarFallback>
					<AvatarImage src='https://uploads-ssl.webflow.com/61d87d426829a9bac65eeb9e/654d2b113b66e71152acc84c_Nick_Headshot_Fall2023.jpg'></AvatarImage>
				</Avatar>

				<Suspense>
					<ContactList type='combobox'>
						{contactId && (
							<h2 className='text-2xl font-semibold group flex items-center gap-0.5 -mr-4'>
								<span>
									{contact?.firstName} {contact?.lastName}
								</span>

								<ContactSelector
									companyId={companyId}
									contactId={contactId}
									minimal={contact !== undefined}
								/>
							</h2>
						)}
					</ContactList>
				</Suspense>

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

				<div className='flex items-center gap-3'>
					<Dialog>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='outline'
									size='icon'
									className='rounded-full'
								>
									<Plus />
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent align='start'>
								<DropdownMenuItem>
									<Laptop className='inline-block mr-1.5' /> Configuration
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<DialogTrigger>
										<Phone className='inline-block mr-1.5' />
										Communication Item
									</DialogTrigger>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add Communication</DialogTitle>
							</DialogHeader>

							<CommunicationItemForm
								contactId={contact?.id}
								types={
									types?.filter((type) => !!!contact?.communicationItems?.some((item) => item.type.id === type.id)) ??
									[]
								}
							/>
						</DialogContent>
					</Dialog>

					<Button
						variant='outline'
						size='icon'
						className='rounded-full'
					>
						<Mail />
					</Button>

					<Button
						variant='outline'
						size='icon'
						className='rounded-full'
					>
						<Phone />
					</Button>

					<Button
						variant='outline'
						size='icon'
						className='rounded-full'
					>
						<Ellipsis />
					</Button>
				</div>

				{/* <Button className='w-full'>Convert to contact</Button> */}

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
