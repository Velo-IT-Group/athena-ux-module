'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneInput } from './phone-input';
import { Form, FormField } from './ui/form';
import { useForm } from 'react-hook-form';
import { CreateParticipantParams, createPartipantParamsSchema } from '@/types/twilio';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = {
	showNumbers?: boolean;
	numbers: { phoneNumber: string; friendlyName: string }[];
	onSubmit?: (data: FormData) => void;
};

const OutboundDialerContent = ({ showNumbers = false, numbers, onSubmit }: Props) => {
	const form = useForm<CreateParticipantParams>({
		resolver: zodResolver(createPartipantParamsSchema),
	});

	return (
		<Form {...form}>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const data = new FormData(e.currentTarget);
					onSubmit?.(data);
				}}
				className='space-y-3'
			>
				<FormField
					control={form.control}
					name='To'
					render={({ field }) => <PhoneInput {...field} />}
				/>

				{/* <Separator /> */}

				{/* {showNumbers && (
					<>
						<LabeledInput
							label='Caller ID'
							name='from'
							id='from'
						>
							<Select
								name='from'
								defaultValue={numbers.length ? numbers[0].phoneNumber : undefined}
							>
								<SelectTrigger>
									<SelectValue placeholder='Select caller id...' />
								</SelectTrigger>

								<SelectContent>
									{numbers?.map((number) => (
										<SelectItem
											key={number.phoneNumber}
											value={number.phoneNumber}
										>
											{number.friendlyName}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</LabeledInput>

						<Separator />
					</>
				)} */}

				{/* <LabeledInput label='Agent'>
				<Suspense><WorkerSelect /></Suspense>
			</LabeledInput> */}

				{/* <Button
					className='w-full space-x-1.5'
					type='submit'
				>
					<Phone className='w-3.5 h-3.5' /> <span>Call</span>
				</Button> */}
				<Button
					type='submit'
					className='w-full'
				>
					Dial
				</Button>
			</form>
		</Form>
	);
};

export default OutboundDialerContent;
