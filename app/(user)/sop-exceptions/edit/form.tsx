'use client';

import React, { useState } from 'react';
import { getCompanies, getCompanyNotes } from '@/lib/manage/read';
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
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
	company: z.number(),
	exceptions: z.string(),
});

type Props = {};

const EditForm = (props: Props) => {
	const router = useRouter();
	// console.log(props.searchParams.companyId);
	const supabase = createClient();
	// supabase.from()

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			company: 250,
			exceptions: '',
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
	const { data: notes } = useQuery({
		queryKey: ['companyNotes', form.getValues().company],
		queryFn: () => getCompanyNotes(form.getValues().company),
	});

	const exception = notes?.find((note) => note.type.id === 6);

	console.log(exception);

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
															router.push(`/sop-exceptions/edit?companyId=${company.id}`);
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

export default EditForm;
