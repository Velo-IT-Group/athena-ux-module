'use client';
import { Combobox } from '@/components/ui/combobox';
import { getContacts } from '@/lib/manage/read';
import { Contact } from '@/lib/manage/types';
import { updateTask } from '@/lib/twilio/taskrouter/helpers';
import React, { useEffect, useState } from 'react';
import { useTaskContext } from './[id]/task-context';

type Props = {
	companyId: string;
	taskSid: string;
	attributes: object;
};

const ContactSelector = ({ companyId, taskSid, attributes }: Props) => {
	const { task } = useTaskContext();
	const [contact, setContact] = useState<Contact>();
	const [contacts, setContacts] = useState<Contact[]>([]);

	useEffect(() => {
		getContacts(parseInt(companyId)).then((c) => {
			setContacts(c);
		});
	}, [companyId]);

	return (
		<Combobox
			placeholder='Filter companies...'
			items={contacts?.map((c) => {
				console.log(c.firstName);
				return { label: `${c.firstName} ${c.lastName}`, value: `${c.id}-${c.firstName} ${c.lastName}` };
			})}
			setValue={async (e) => {
				if (!task) return;
				let parsedId = e.toString().split('-')[0];
				setContact(contacts.find((c) => c.id === parseInt(parsedId)));
				await updateTask(task.sid, { attributes: JSON.stringify({ ...attributes, userId: parsedId }) });
			}}
			value={`${contact?.id}-${contact?.firstName} ${contact?.lastName}`}
		/>
	);
};

export default ContactSelector;
