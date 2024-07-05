'use client';
import React, { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Phone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { PopoverContent } from '@/components/ui/popover';
import { Dialpad } from './dialpad';
import { call } from '@/lib/twilio/read';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LabeledInput from './ui/labeled-input';
// import { cookies } from 'next/headers';
import { useTwilio } from '@/providers/twilio-provider';
import { toast } from 'sonner';
import IncomingCall from './incoming-call';
import { ActiveCall } from './call-modal';
import { getTask } from '@/lib/twilio/taskrouter/helpers';
import WorkerSelector from '@/app/(user)/worker-selector';
import PhoneNumberSelect from './phone-number-select';
import WorkerSelect from './worker-select';

type Props = {
	numbers: { phoneNumber: string; friendlyName: string }[];
};

const OutboundDialerContent = ({ numbers }: Props) => {
	const { worker, setActiveCall, activeCall } = useTwilio();
	// const cookieStore = cookies();
	// const lastNumber = cookieStore.get('lastUsedNumber');

	return (
		<PopoverContent align='end'>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					var data = new FormData(e.currentTarget);

					if (!worker) return;
					const to = data.get('phoneNumber') as string;
					const from = data.get('from') as string;
					const workflowSid = data.get('from') as string;
					const taskQueueSid = data.get('from') as string;
					console.log(data);
					await worker.createTask(
						'+19015988651',
						'+18449402678',
						'WW497b90bc1703176f6845c09c8bf4fa8a',
						'WQee659e96340b3899ad1fad7578fe6515',
						{
							attributes: {
								direction: 'outboundDial',
							},
						}
					);
					// toast.custom((t) => <ActiveCall activeCall={activeCall} />);
				}}
				className='space-y-3'
			>
				<Dialpad />

				<div className='grid grid-cols-3 gap-1.5 w-full'>
					<div></div>

					<Button
						variant='ghost'
						size='lg'
						type='button'
						className='text-xl'
					>
						0
					</Button>
				</div>

				<Separator />

				<LabeledInput
					label='Caller ID'
					name='from'
					id='from'
				>
					<Suspense
						fallback={
							<Select>
								<SelectTrigger disabled>
									<SelectValue placeholder='Select caller id...' />
								</SelectTrigger>
							</Select>
						}
					>
						<PhoneNumberSelect />
					</Suspense>
				</LabeledInput>

				<Separator />

				<LabeledInput label='Agent'>
					<Suspense>
						<WorkerSelect />
					</Suspense>
				</LabeledInput>

				<Button className='w-full space-x-1.5'>
					<Phone className='w-3.5 h-3.5' /> <span>Call</span>
				</Button>
			</form>
		</PopoverContent>
	);
};

export default OutboundDialerContent;
