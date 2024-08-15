'use client';
import React from 'react';
import { Company, type ServiceTicket, serviceTicketSchema, TimeEntry, timeEntrySchema } from '@/types/manage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Step, Stepper, useStepper, type StepItem } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';

type Props = {
	timeEntry: TimeEntry;
};

const TimeEntryForm = ({ timeEntry }: Props) => {
	const form = useForm<TimeEntry>({
		resolver: zodResolver(timeEntrySchema),
		defaultValues: timeEntry,
	});

	function onSubmit(values: TimeEntry) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-3'
			></form>
		</Form>
	);
};

export default TimeEntryForm;
