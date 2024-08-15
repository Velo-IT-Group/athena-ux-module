'use client';
import React from 'react';
import { Step, Stepper, useStepper, type StepItem } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';

type Props = {};

const steps = [{ label: 'Overview' }, { label: 'Time' }, { label: 'Additional' }] satisfies StepItem[];

const TicketFormStepper = (props: Props) => {
	return (
		<div className='flex w-full flex-col gap-4'>
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
							<div className='h-40 flex items-center justify-center my-4 border bg-secondary text-primary rounded-md'>
								<h1 className='text-xl'>Step {index + 1}</h1>
							</div>
						</Step>
					);
				})}
				<Footer />
			</Stepper>
		</div>
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

export default TicketFormStepper;
