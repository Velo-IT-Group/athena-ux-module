'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getContacts } from '@/lib/manage/read';
import { useTaskContext } from '../../providers/task-context';
import { Contact } from '@/types/manage';
import { updateTask } from '@/lib/twilio/taskrouter/helpers';
import { revalidatePath } from 'next/cache';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Props = {
	companyId?: number;
	contactId?: number;
	minimal?: boolean;
};

const ContactSelector = ({ companyId, contactId, minimal = false }: Props) => {
	const { task, attributes } = useTaskContext();
	const [open, setOpen] = useState(false);
	const [contact, setContact] = useState<Contact>();
	const [contacts, setContacts] = useState<Contact[]>([]);
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	useEffect(() => {
		getContacts({
			conditions: companyId ? [{ parameter: { 'company/id': companyId } }, { parameter: { inactiveFlag: false } }] : [],
			childConditions: [{ parameter: { 'types/id': 17 } }],
			pageSize: 1000,
			orderBy: { key: 'firstName' },
		}).then((c) => {
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

	// Get a new searchParams string by merging the current
	// searchParams with a provided key/value pair
	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);

			return params.toString();
		},
		[searchParams]
	);

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
					{!minimal && 'Select a user...'}

					<ChevronsUpDown className={cn('h-3.5 w-3.5 shrink-0 opacity-50', !minimal && 'ml-1.5')} />
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
									router.push(pathname + '?' + createQueryString('contactId', String(userId)));
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
								<Check className={cn('mr-2 h-3.5 w-3.5', contact?.id === c.id ? 'opacity-100' : 'opacity-0')} />
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
