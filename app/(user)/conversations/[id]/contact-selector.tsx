'use client';

import { useEffect, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getContacts } from '@/lib/manage/read';
import { useTaskContext } from './task-context';
import { Contact } from '@/types/manage';
import { updateTask } from '@/lib/twilio/taskrouter/helpers';
import { revalidatePath } from 'next/cache';

type Props = {
	companyId: string;
	contactId?: number;
	minimal?: boolean;
};

const ContactSelector = ({ companyId, contactId, minimal = false }: Props) => {
	const { task, attributes } = useTaskContext();
	const [open, setOpen] = useState(false);
	const [contact, setContact] = useState<Contact>();
	const [contacts, setContacts] = useState<Contact[]>([]);

	useEffect(() => {
		getContacts(parseInt(companyId)).then((c) => {
			setContacts(c);
			console.log(
				contactId,

				c.find((con) => con.id === contactId)
			);
			if (contactId) {
				setContact(c.find((con) => con.id === contactId));
			}
		});
	}, [companyId, task, contactId]);

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<Button
					variant={minimal ? 'ghost' : 'outline'}
					role='combobox'
					aria-expanded={open}
					className='justify-between'
				>
					{!minimal && contact && `${contact.firstName} ${contact.lastName}`}
					<ChevronsUpDown className={cn('h-4 w-4 shrink-0 opacity-50', !minimal && 'ml-1.5')} />
				</Button>
			</PopoverTrigger>

			<PopoverContent className='min-w-52 p-0'>
				<Command>
					<CommandInput placeholder='Filter contacts...' />
					<CommandEmpty>No contacts found.</CommandEmpty>
					<CommandList>
						{contacts.map((c) => (
							<CommandItem
								key={c.id}
								value={`${c.id}-${c.firstName} ${c.lastName}`}
								onSelect={async (currentValue) => {
									const userId = parseInt(currentValue.split('-')[0]);
									const c = contacts.find((con) => con.id === userId);
									setContact(c);
									setOpen(false);
									console.log(task?.sid, userId);
									if (!task || !userId) return;
									const tt = await updateTask(task.sid, {
										attributes: JSON.stringify({
											...attributes,
											userId,
											firstName: c?.firstName,
											lastName: c?.lastName,
										}),
									});
									console.log(tt);
									revalidatePath('/');
								}}
							>
								<Check className={cn('mr-2 h-4 w-4', contact?.id === c.id ? 'opacity-100' : 'opacity-0')} />
								{c.firstName} {c.lastName}
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default ContactSelector;
