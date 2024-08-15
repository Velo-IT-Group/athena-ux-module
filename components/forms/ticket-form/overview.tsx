import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { Company, ServiceTicket } from '@/types/manage';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Suspense, useState } from 'react';
import ContactSelector from './contact-selector';

type Props = {
	form: UseFormReturn<ServiceTicket>;
	companies: Company[];
};

const TicketOverview = ({ form, companies }: Props) => {
	const [companyId, setCompanyId] = useState<number>();
	return (
		<>
			<FormField
				control={form.control}
				name='summary'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Summary</FormLabel>
						<FormControl>
							<Textarea
								placeholder='Put ticket summary here'
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='company.id'
				render={({ field }) => (
					<FormItem className='flex flex-col'>
						<FormLabel>Company</FormLabel>

						<Popover>
							<PopoverTrigger asChild>
								<FormControl>
									<Button
										variant='outline'
										role='combobox'
										className={cn('justify-between', !field.value && 'text-muted-foreground')}
									>
										{field.value
											? companies.find((company) => company.id === field.value)?.name
											: 'Select a company...'}
										<ChevronsUpDown className='ml-1.5 h-3.5 w-3.5 shrink-0 opacity-50' />
									</Button>
								</FormControl>
							</PopoverTrigger>
							<PopoverContent className='p-0'>
								<Command>
									<CommandInput
										placeholder='Search companies...'
										className='h-9'
									/>
									<CommandList>
										<CommandEmpty>No framework found.</CommandEmpty>
										<CommandGroup>
											{companies.map((company) => (
												<CommandItem
													// @ts-ignore
													value={company.id}
													key={company.id}
													onSelect={() => {
														form.setValue('company.id', company.id);
														setCompanyId(company.id);
													}}
												>
													{company.name}
													<Check
														className={cn(
															'ml-auto h-3.5 w-3.5',
															company.id === field.value ? 'opacity-100' : 'opacity-0'
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

			<Suspense>
				<ContactSelector
					form={form}
					companyId={companyId}
				/>
			</Suspense>
			{/* {form.getValues() && form.getValues().company && form.getValues().company?.id && (
			)} */}

			<FormField
				control={form.control}
				name='initialDescription'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Description</FormLabel>
						<FormControl>
							<Textarea
								placeholder='Put ticket summary here'
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
};

export default TicketOverview;
