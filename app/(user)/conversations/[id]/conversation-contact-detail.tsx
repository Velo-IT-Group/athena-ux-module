import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getContact, getContacts } from '@/lib/manage/read';
import { Building, Ellipsis, Mail, Phone, Plus } from 'lucide-react';
import React, { Suspense } from 'react';
import ContactSelector from '../contact-selector';

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

	return (
		<aside className='flex flex-col items-center gap-3 p-3 bg-background border-r'>
			<Avatar className='w-20 h-20'>
				<AvatarFallback>{contactId ? `${contact?.firstName} ${contact?.lastName}` : 'UU'}</AvatarFallback>
				<AvatarImage src='https://uploads-ssl.webflow.com/61d87d426829a9bac65eeb9e/654d2b113b66e71152acc84c_Nick_Headshot_Fall2023.jpg'></AvatarImage>
			</Avatar>

			{contactId ? (
				<h2 className='text-2xl font-semibold'>
					{contact?.firstName} {contact?.lastName}
				</h2>
			) : (
				<Suspense>
					<ContactSelector companyId={companyId ?? ''} />
				</Suspense>
			)}

			<div className='flex items-center gap-1.5 text-muted-foreground'>
				<Building />

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
				<Button
					variant='outline'
					size='icon'
					className='rounded-full'
				>
					<Plus />
				</Button>

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
						<Label htmlFor='email'>Email</Label>
						<p>nblack@velomethod.com</p>
					</div>

					<div className='grid gap-1.5'>
						<Label htmlFor='phone'>Title</Label>
						<p>Full Stack Developer</p>
					</div>

					<div className='grid gap-1.5'>
						<Label htmlFor='phone'>Phone</Label>
						<p>(555) 555-5555</p>
					</div>

					<div className='grid gap-1.5'>
						<Label htmlFor='phone'>Department</Label>
						<p>(555) 555-5555</p>
					</div>
				</TabsContent>
				<TabsContent value='profile'></TabsContent>
			</Tabs>
		</aside>
	);
};

export default ConversationContactDetail;
