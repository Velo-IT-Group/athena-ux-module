import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { getAllContacts, getContacts } from '@/lib/manage/read';
import { UseFormReturn } from 'react-hook-form';
import { Contact, ServiceTicket } from '@/types/manage';
import { useEffect, useState } from 'react';

type Props = {
	form: UseFormReturn<ServiceTicket>;
	companyId?: number;
};

const ContactSelector = ({ form, companyId }: Props) => {
	const [contacts, setContacts] = useState<Contact[]>([]);

	useEffect(() => {
		getContacts({
			conditions: [{ parameter: { 'company/id': companyId ?? 250 } }],
			orderBy: { key: 'firstName' },
			fields: ['id', 'firstName', 'lastName'],
			pageSize: 1000,
		}).then(setContacts);
	}, [companyId]);

	return (
		<FormField
			control={form.control}
			name='contact.id'
			render={({ field }) => (
				<FormItem className='flex flex-col'>
					<FormLabel>Contact</FormLabel>

					<Popover>
						<PopoverTrigger asChild>
							<FormControl>
								<Button
									variant='outline'
									role='combobox'
									className={cn('justify-between', !field.value && 'text-muted-foreground')}
								>
									{field.value
										? `${contacts.find((contact) => contact.id === field.value)?.firstName} ${
												contacts.find((contact) => contact.id === field.value)?.lastName ?? ''
										  }`
										: 'Select a contact...'}
									<ChevronsUpDown className='ml-1.5 h-3.5 w-3.5 shrink-0 opacity-50' />
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent className='p-0'>
							<Command>
								<CommandInput
									placeholder='Search contact...'
									className='h-9'
								/>
								<CommandList>
									<CommandEmpty>No contact found.</CommandEmpty>
									<CommandGroup>
										{contacts?.map((contact) => (
											<CommandItem
												// @ts-ignore
												value={contact.id}
												key={contact.id}
												onSelect={() => {
													form.setValue('contact.id', contact.id);
												}}
											>
												{contact.firstName} {contact?.lastName ?? ''}
												<Check
													className={cn(
														'ml-auto h-3.5 w-3.5',
														contact.id === field.value ? 'opacity-100' : 'opacity-0'
													)}
												/>
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>

					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default ContactSelector;
