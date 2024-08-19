'use client';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { getContacts } from '@/lib/manage/read';
import { Contact, ReferenceType } from '@/types/manage';
import { Building, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Props = {
	company?: ReferenceType;
	contact?: ReferenceType;
};

const ContactSelector = ({ company, contact }: Props) => {
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [selectedContact, setSelectedContact] = useState<Contact>();

	console.log(company, contact);

	useEffect(() => {
		if (!company?.id || !contact?.id) return;

		getContacts({
			conditions: [{ parameter: { 'company/id': company.id } }],
			pageSize: 1000,
			orderBy: { key: 'firstName' },
		}).then((data) => {
			setContacts(data);
			setSelectedContact(data.find((d) => d.id === contact?.id));
		});
	}, []);

	return (
		<Combobox
			items={contacts.map((contact) => {
				return {
					label: `${contact?.firstName} ${contact?.lastName}`,
					value: `${contact?.id}-${contact?.firstName} ${contact?.lastName}`,
				};
			})}
			side='left'
			align='start'
			placeholder='Select a contact...'
			value={`${selectedContact?.id}-${selectedContact?.firstName} ${selectedContact?.lastName}`}
			// setValue={(e) => {
			// 	let id = e.toString().split('-')[0];
			// 	setSelectedContact(contacts.find((d) => d.id === Number(id)));
			// }}
		>
			<Button
				size='sm'
				variant='ghost'
				className='flex'
			>
				<User className='mr-1.5' />
				<span className='text-xs text-muted-foreground'>
					{selectedContact ? `${selectedContact.firstName} ${selectedContact.lastName}` : 'Add contact'}
				</span>
			</Button>
		</Combobox>
	);
};

export default ContactSelector;
