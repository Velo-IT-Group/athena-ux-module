'use client';
import LabeledInput from '@/components/ui/labeled-input';
import { TabsContent } from '@/components/ui/tabs';
import { type Contact, contactSchema } from '@/types/manage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Props = {
	contact?: Contact;
};

const ContactProfileForm = ({ contact }: Props) => {
	const formRef = useRef<HTMLFormElement>(undefined);
	const form = useForm<Contact>({
		resolver: zodResolver(contactSchema),
		defaultValues: contact,
	});

	// 2. Define a submit handler.
	function onSubmit(values: Contact) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-3'
				// @ts-ignore
				ref={formRef}
			>
				<FormField
					control={form.control}
					name='nickName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nickname</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='gender'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Gender</FormLabel>
							<FormControl>
								<Select
									name='gender'
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<SelectTrigger>
										<SelectValue placeholder='Select a gender...' />
									</SelectTrigger>

									<SelectContent>
										<SelectItem value='Male'>Male</SelectItem>
										<SelectItem value='Female'>Female</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='school'
					render={({ field }) => (
						<FormItem>
							<FormLabel>School</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='birthDay'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Birthday</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='significantOther'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Significant Other</FormLabel>
							<FormControl
								onBlur={(e) => {
									// @ts-ignore
									if (contact && contact[field.name] && e.target.value !== contact[field.name]) {
										formRef?.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
									}
								}}
							>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type='submit'>Submit</Button>
			</form>
		</Form>
	);
};

export default ContactProfileForm;
