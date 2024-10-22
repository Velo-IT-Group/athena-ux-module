'use client';

import React, { useState } from 'react';
import { getCompanies } from '@/lib/manage/read';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MinimalTiptapEditor } from '@/components/tiptap';
import { Content } from '@tiptap/core';

const formSchema = z.object({
	company: z.number(),
	exceptions: z.string(),
});

type Props = {};

const Page = (props: Props) => {
	const [value, setValue] = useState<Content>(
		'<p class="text-node">IOT devices</p><p class="text-node">-MAAS 360 is used for Mobile Device Management (MDM) of all IOS devices that are used for VIP Mobile apps</p><p class="text-node">-Karen Richard main POC for IOS devices</p><p class="text-node">iPads and iPhones are company assigned and enrolled in MaaS360</p><p class="text-node">DO NOT give out the iTunes account information. Inevitably, this will lead to issues.</p><p class="text-node">Apple IDs for Maas:</p><p class="text-node">Drivers have an Apple ID that is in Manage</p><p class="text-node">Salesmen have their own email accounts</p><p class="text-node">Users authorized to use their own Apple IDs</p><p class="text-node">Tyone Cormier, Theron Pitre, Chris Robicheaux</p><p class="text-node">Drivers:</p><p class="text-node">They NO LONGER share an email accout (<a class="link" href="mailto:drivers@acadianabottling.com">drivers@acadianabottling.com</a>)</p><p class="text-node">Each Driver needs to have their own individual Driver accounts </p><p class="text-node">e.g. <a class="link" href="mailto:Driver1@acadianabottling.com">Driver1@acadianabottling.com</a> , <a class="link" href="mailto:Driver2@acadianabottling.com">Driver2@acadianabottling.com</a></p><p class="text-node">Drivers previously shared a single account (<a class="link" href="mailto:Drivers@acadianabottling.com">Drivers@acadianabottling.com</a>)</p><p class="text-node">DO NOT RESET THIS ACCOUNT. This is shared across all devices, and any change will have a huge impact on their day to day operations. DO NOT RESET THIS ACCOUNT.</p>'
	);
	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			company: 250,
			exceptions:
				'<p class="text-node">IOT devices</p><ul class="list-node"><li><p class="text-node">MAAS 360 is used for Mobile Device Management (<span>MDM</span>) of all <span>IOS</span> devices that are used for <span>VIP</span> Mobile apps</p></li><li><p class="text-node">Karen Richard main <span>POC</span> for IOS devices</p></li><li><p class="text-node">iPads and iPhones are company assigned and enrolled in MaaS360</p></li><li><p class="text-node"><strong>DO NOT give out the iTunes account information. Inevitably, this will lead to issues.</strong></p></li></ul><p class="text-node">Apple IDs for Maas:</p><ul class="list-node"><li><p class="text-node">Drivers have an Apple ID that is in Manage</p></li><li><p class="text-node">Salesmen have their own email accounts</p></li><li><p class="text-node">Users authorized to use their own Apple IDs</p><ul class="list-node"><li><p class="text-node">Tyone Cormier, Theron Pitre, Chris Robicheaux</p></li></ul></li></ul><p class="text-node">Drivers:</p><ul class="list-node"><li><p class="text-node">They NO LONGER share an email accout (<a class="link" href="mailto:drivers@acadianabottling.com">drivers@acadianabottling.com</a>)</p></li><li><p class="text-node">Each Driver needs to have their own individual Driver accounts</p><ul class="list-node"><li><p class="text-node">e.g. <a class="link" href="mailto:Driver1@acadianabottling.com">Driver1@acadianabottling.com</a> , <a class="link" href="mailto:Driver2@acadianabottling.com">Driver2@acadianabottling.com</a></p></li></ul></li><li><p class="text-node">Drivers previously shared a single account (<a class="link" href="mailto:Drivers@acadianabottling.com">Drivers@acadianabottling.com</a>)</p><ul class="list-node"><li><p class="text-node"><span style="color: var(--mt-accent-red)"><strong>DO </strong><em>NOT</em><strong> RESET THIS ACCOUNT. This is shared across all devices, and any change will have a huge impact on their day to day operations. </strong><em>DO NOT RESET THIS ACCOUNT.</em></span></p></li></ul></li></ul>',
		},
	});
	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}
	const { data } = useQuery({
		queryKey: ['companies'],
		queryFn: () =>
			getCompanies({
				childConditions: { 'types/id': 1 },
				orderBy: { key: 'name', order: 'asc' },
				fields: ['id', 'name'],
				pageSize: 1000,
			}),
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-8 grid place-items-center max-w-lg w-full p-3'
			>
				<FormField
					control={form.control}
					name='company'
					render={({ field }) => (
						<FormItem className='flex flex-col w-full'>
							<FormLabel>Company</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl className='w-full'>
										<Button
											variant='outline'
											role='combobox'
											className={cn('justify-between w-full', !field.value && 'text-muted-foreground')}
										>
											{field.value ? data?.data.find((company) => company.id === field.value)?.name : 'Select company'}
											<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className=' p-0'>
									<Command>
										<CommandInput placeholder='Search language...' />
										<CommandList>
											<CommandEmpty>No language found.</CommandEmpty>
											<CommandGroup>
												{data?.data.map((company) => (
													<CommandItem
														value={company.name}
														key={company.name}
														onSelect={() => {
															form.setValue('company', company.id);
														}}
													>
														<Check
															className={cn('mr-2 h-4 w-4', company.id === field.value ? 'opacity-100' : 'opacity-0')}
														/>
														{company.name}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							<FormDescription>This is the language that will be used in the dashboard.</FormDescription>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='exceptions'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<MinimalTiptapEditor
									{...field}
									onChange={(e) => {
										if (e?.toString()) {
											form.setValue('exceptions', e?.toString());
										}
									}}
									className='w-full'
									editorContentClassName='p-5'
									output='html'
									placeholder='Type your description here...'
									autofocus={true}
									editable={true}
									editorClassName='focus:outline-none'
								/>
							</FormControl>
							{/* <FormDescription>{form.getValues?.toString()}</FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type='submit'>Submit</Button>
			</form>
		</Form>
	);
};

export default Page;
