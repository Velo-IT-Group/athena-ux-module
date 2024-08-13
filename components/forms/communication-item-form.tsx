'use client';
import { type CommunicationItem, communicationItemSchema, CommunicationType } from '@/types/manage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhoneInput } from '../phone-input';
import { DialogClose } from '../ui/dialog';
import { useDevice } from '@/providers/device-provider';
import { Input } from '../ui/input';

type Props = {
	contactId?: number;
	communicationItem?: CommunicationItem;
	types: CommunicationType[];
};

const CommunicationItemForm = ({ contactId, communicationItem, types }: Props) => {
	const { activeCalls } = useDevice();
	const form = useForm<CommunicationItem>({
		resolver: zodResolver(communicationItemSchema),
		defaultValues:
			!communicationItem && activeCalls.length ? { value: activeCalls[0].parameters.From } : communicationItem,
	});

	const phoneInputs = types.filter((type) => type.phoneFlag);

	// 2. Define a submit handler.
	function onSubmit(values: CommunicationItem) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}

	console.log(form.getValues());

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-3'
			>
				<FormField
					control={form.control}
					name='type.name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Type</FormLabel>
							<FormControl>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<SelectTrigger>
										<SelectValue
											placeholder='Select a type...'
											{...field}
										/>
									</SelectTrigger>

									<SelectContent>
										{types.map((type) => (
											<SelectItem
												key={type.id}
												value={type.description}
											>
												{type.description}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{phoneInputs.some((input) => input.description === form.getValues().type?.name) ? (
					<FormField
						control={form.control}
						name='value'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Value</FormLabel>
								<FormControl>
									<PhoneInput
										placeholder='(123) 456-7890'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				) : (
					<FormField
						control={form.control}
						name='value'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Value</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				{/* <div className='flex items-center gap-3 w-full justify-end'>
					<DialogClose asChild>
						<Button variant='secondary'>Close</Button>
					</DialogClose>

				</div> */}
				<Button>Submit</Button>
			</form>
		</Form>
	);
};

export default CommunicationItemForm;
