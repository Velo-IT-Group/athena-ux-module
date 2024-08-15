'use client';
import React from 'react';
import { Company, type ServiceTicket, serviceTicketSchema } from '@/types/manage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Step, Stepper, useStepper, type StepItem } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import TicketOverview from './overview';

const steps = [{ label: 'Overview' }, { label: 'Time' }, { label: 'Additional' }] satisfies StepItem[];

type Props = {
	ticket?: ServiceTicket;
	companies: Company[];
};

const TicketForm = ({ ticket, companies }: Props) => {
	const form = useForm<ServiceTicket>({
		resolver: zodResolver(serviceTicketSchema),
		defaultValues: ticket,
	});

	function onSubmit(values: ServiceTicket) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}

	return (
		<Form {...form}>
			<Stepper
				initialStep={0}
				steps={steps}
			>
				{steps.map(({ label }, index) => {
					return (
						<Step
							key={label}
							label={label}
						>
							<div className='flex w-full flex-col gap-3'>
								{/* <div></div> */}
								{index === 0 && (
									<TicketOverview
										form={form}
										companies={companies}
									/>
								)}
								{/* <div className='h-40 flex items-center justify-center my-4 border bg-secondary text-primary rounded-md'>
									<h1 className='text-xl'>Step {index + 1}</h1>
									</div> */}
							</div>
						</Step>
					);
				})}
				<Footer />
			</Stepper>
		</Form>
	);
};

const Footer = () => {
	const { nextStep, prevStep, resetSteps, isDisabledStep, hasCompletedAllSteps, isLastStep, isOptionalStep } =
		useStepper();
	return (
		<>
			{hasCompletedAllSteps && (
				<div className='h-40 flex items-center justify-center my-4 border bg-secondary text-primary rounded-md'>
					<h1 className='text-xl'>Woohoo! All steps completed! 🎉</h1>
				</div>
			)}
			<div className='w-full flex justify-end gap-2'>
				{hasCompletedAllSteps ? (
					<Button
						size='sm'
						onClick={resetSteps}
					>
						Reset
					</Button>
				) : (
					<>
						<Button
							disabled={isDisabledStep}
							onClick={prevStep}
							size='sm'
							variant='secondary'
						>
							Prev
						</Button>
						<Button
							size='sm'
							onClick={nextStep}
						>
							{isLastStep ? 'Finish' : isOptionalStep ? 'Skip' : 'Next'}
						</Button>
					</>
				)}
			</div>
		</>
	);
};

export default TicketForm;
