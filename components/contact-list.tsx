import { Contact, ReferenceType } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import React from 'react';
import { Combobox } from './ui/combobox';
import { getContacts } from '@/lib/manage/read';
import { Button } from './ui/button';
import { User } from 'lucide-react';

type Props = {
	type: 'table' | 'combobox' | 'select';
	defaultValue?: ReferenceType;
	params?: Conditions<Contact>;
};

const ContactList = async ({
	type,
	defaultValue,
	params = {
		childConditions: [{ parameter: { 'types/id': 17 } }],
		pageSize: 1000,
		orderBy: { key: 'firstName' },
	},
}: Props) => {
	const contacts = await getContacts(params);

	return (
		<>
			{type === 'combobox' && (
				<Combobox
					items={
						contacts?.map(({ id, firstName, lastName }) => {
							return { label: `${firstName} ${lastName}`, value: `${id}-${firstName} ${lastName}` };
						}) ?? []
					}
					value={`${defaultValue?.id}-${defaultValue?.name}`}
					// setValue={async (e) => {}}
					placeholder='Filter contacts...'
					side='left'
					align='start'
				>
					<Button
						size='sm'
						variant='ghost'
						role='combobox'
						className='flex'
					>
						<User className='mr-1.5' />
						<span className='text-xs text-muted-foreground'>{defaultValue ? defaultValue.name : 'Add contact'}</span>
					</Button>
				</Combobox>
			)}
		</>
	);
};

export default ContactList;
