import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getContact, getContacts } from '@/lib/manage/read';
import { Ellipsis, Laptop, Mail, Phone, Plus } from 'lucide-react';
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

type Props = {
	contactId?: string;
	companyId?: string;
	attributes: Record<string, any>;
};

const ConversationContactDetail = async ({ contactId, companyId, attributes }: Props) => {
	const [contact, contacts] = await Promise.all([
		getContact(parseInt(contactId ?? '')),
		getContacts(parseInt(companyId ?? '')),
	]);

	const groupedCommunications = groupBy(contact?.communicationItems, 'communicationType');

	return (
		<aside className='flex flex-col items-center gap-3 p-3 bg-background border-r'>
			<Avatar className='w-20 h-20'>
				<AvatarFallback>{contactId ? `${contact?.firstName} ${contact?.lastName}` : 'UU'}</AvatarFallback>
				<AvatarImage src='https://uploads-ssl.webflow.com/61d87d426829a9bac65eeb9e/654d2b113b66e71152acc84c_Nick_Headshot_Fall2023.jpg'></AvatarImage>
			</Avatar>

			{contactId ? (
				<h2 className='text-2xl font-semibold group flex items-center gap-0.5 -mr-4'>
					<span>
						{contact?.firstName} {contact?.lastName}
					</span>

					<ContactSelector
						companyId={companyId ?? '250'}
						contactId={parseInt(contactId ?? '10')}
						minimal
					/>
				</h2>
			) : (
				<Suspense>
					<ContactSelector
						companyId={companyId ?? '250'}
						contactId={parseInt(contactId ?? '10')}
					/>
				</Suspense>
			)}

			<div className='flex items-center gap-1.5 text-muted-foreground'>
				{/* <Building /> */}

				<span className='text-sm font-medium'>{attributes.companyName}</span>

				{attributes.isVip && (
					<Badge
						variant='caution'
						className='rounded'
					>
						VIP
					</Badge>
				)}
			</div>

			<div className='flex items-center gap-3'>
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
						<DropdownMenuItem>
							<Phone className='inline-block mr-1.5' />
							Communication Item
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

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

			<Button className='w-full'>Convert to contact</Button>

			<Tabs
				defaultValue='overview'
				className='w-full'
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
					className='grid gap-3'
				>
					<div className='grid gap-1.5'>
						<Label htmlFor='title'>Title</Label>
						<p>{contact?.title}</p>
					</div>

					{Object.entries(groupedCommunications).map(([key, values]) => (
						<div
							className='grid gap-1.5'
							key={key}
						>
							<Label htmlFor='email'>{key}</Label>
							{values.map(({ id, value, type }) => {
								return (
									<div
										key={id}
										className='flex items-center border border-input rounded-md overflow-hidden'
									>
										<div className='bg-muted/50 h-9 w-12 px-1.5 text-xs text-muted-foreground font-medium grid place-items-center border-r'>
											{type.name}
										</div>

										<Input
											className='h-9 rounded-none border-0 px-1.5'
											defaultValue={value}
										/>
									</div>
								);
							})}
						</div>
					))}
				</TabsContent>

				<TabsContent
					value='profile'
					className='space-y-3'
				>
					<LabeledInput
						label='Nickname'
						defaultValue={contact?.nickName}
						name='nickName'
					/>

					<LabeledInput
						label='Nickname'
						defaultValue={contact?.nickName}
						name='nickName'
					>
						<Select
							name='gender'
							defaultValue={contact?.gender}
						>
							<SelectTrigger>
								<SelectValue placeholder='Select a gender...' />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value='Male'>Male</SelectItem>
								<SelectItem value='Female'>Female</SelectItem>
							</SelectContent>
						</Select>
					</LabeledInput>

					<LabeledInput
						label='School'
						defaultValue={contact?.school}
						name='school'
					/>

					<LabeledInput
						label='Birthday'
						name='birthday'
					>
						<DatePicker
							name='birthDay'
							date={contact?.birthDay ? new Date(contact?.birthDay) : undefined}
						/>
					</LabeledInput>

					<LabeledInput
						label='Significant Other'
						name='significantOther'
						defaultValue={contact?.significantOther}
					/>

					<LabeledInput
						label='Personal Address'
						name='personalAddress'
					>
						<Input
							name='addressLine1'
							defaultValue={contact?.addressLine1}
							placeholder='Address Line 1'
						/>

						<Input
							name='addressLine2'
							defaultValue={contact?.addressLine2}
							placeholder='Address Line 2'
						/>

						<Input
							name='city'
							defaultValue={contact?.city}
							placeholder='City'
						/>

						<Input
							name='state'
							defaultValue={contact?.state}
							placeholder='State'
						/>

						<Input
							name='zip'
							defaultValue={contact?.zip}
							placeholder='Zip'
						/>
					</LabeledInput>

					<LabeledInput
						label='Anniversary'
						name='anniversary'
					>
						<DatePicker date={contact?.anniversary ? new Date(contact?.anniversary) : undefined} />
					</LabeledInput>

					{/* <div className='grid gap-1.5'>
						<Label htmlFor='contactManager'>Reports To</Label>

						<p>{contact?.managerContact?.name}</p>
					</div>

					<div className='grid gap-1.5'>
						<Label htmlFor='userDefinedField6'>Legal Name</Label>

						<p>{contact?.userDefinedField6}</p>
					</div> */}
				</TabsContent>
			</Tabs>
		</aside>
	);
};

export default ConversationContactDetail;
