'use client';
import React from 'react';
import { CardFooter } from '../ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';
import { ArrowRightFromLine, Grip, Mic, Pause, Phone, PhoneForwarded } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { useDevice } from '@/providers/device-provider';
import WorkerSelector from '@/app/(user)/worker-selector';
import { parsePhoneNumber } from '@/lib/utils';
import OutboundDialerContent, { outboundPhoneSchema } from '../outbound-dialer-content';
import { useTaskContext } from './context';
import { toast } from 'sonner';
import { removeConferenceParticipant } from '@/lib/twilio/conference/helpers';
import { z } from 'zod';
import { Dialpad } from '../dialpad';

const ActiveCallFooter = () => {
	const {
		transferTask,
		addExternalParticipant,
		task,
		endConference,
		conferenceParticipants,
		conference,
		removeParticipantByName,
		wrapUpTask,
		updateParticipants,
	} = useTaskContext();
	const { muted, setMuted, activeCall } = useDevice();

	async function onSubmit(values: z.infer<typeof outboundPhoneSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		try {
			const parsedNumber = parsePhoneNumber(values.To, 'US', 'E.164').formattedNumber ?? '';
			const attributes = {
				externalContact: parsePhoneNumber(values.To, 'US').formattedNumber,
			};
			addExternalParticipant?.mutate({
				From: task?.attributes.to ?? task?.attributes.from,
				To: parsedNumber,
				attributes,
			});
		} catch (error) {
			toast.error(JSON.stringify(error, null, 2));
		}
	}

	return (
		<CardFooter className='p-3 border-t space-x-1.5 justify-between'>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant={muted ? 'destructive' : 'accepting'}
						size='icon'
						onClick={() => setMuted((prev) => !prev)}
					>
						<Mic className='w-3.5 h-3.5' />
					</Button>
				</TooltipTrigger>

				<TooltipContent
					side='top'
					align='center'
				>
					<span>Mute</span>
				</TooltipContent>
			</Tooltip>

			<div className='flex items-center gap-1.5'>
				<Tooltip>
					<TooltipTrigger asChild>
						<WorkerSelector
							actionFn={(isWorker, id) => {
								if (isWorker) {
									transferTask?.mutate({
										to: id as string,
										options: {},
									});
									updateParticipants('transferredWorker', id as string).then(console.log);
								} else {
									const parsedNumber = parsePhoneNumber(id as string, 'US', 'E.164').formattedNumber ?? '';
									const attributes = {
										externalContact: parsePhoneNumber(id as string, 'US').formattedNumber,
									};
									addExternalParticipant?.mutate({
										From: task?.attributes.to ?? task?.attributes.from,
										To: parsedNumber,
										attributes,
									});
								}
							}}
						>
							<Button
								variant='secondary'
								size='icon'
							>
								<PhoneForwarded />
							</Button>
						</WorkerSelector>
					</TooltipTrigger>

					<TooltipContent
						side='top'
						align='center'
					>
						<span>Transfer Call</span>
					</TooltipContent>
				</Tooltip>

				<Popover>
					<Tooltip>
						<TooltipTrigger asChild>
							<PopoverTrigger asChild>
								<Button
									variant='secondary'
									size='icon'
								>
									<Grip className='h-3.5 w-3.5' />
								</Button>
							</PopoverTrigger>
						</TooltipTrigger>

						<TooltipContent
							side='top'
							align='center'
						>
							<span>Show Keypad</span>
						</TooltipContent>
					</Tooltip>

					<PopoverContent
						side='bottom'
						align='start'
						className='w-auto'
						forceMount
					>
						<Dialpad onValueChange={(value) => activeCall?.sendDigits(value)} />
					</PopoverContent>
				</Popover>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant='secondary'
							size='icon'
							onClick={async () => {
								console.log(conferenceParticipants.customer);
								try {
									await task?.hold(conferenceParticipants.customer.sid, true);
								} catch (error) {
									toast.error(error as string);
								}
							}}
						>
							<Pause className='h-3.5 w-3.5' />
						</Button>
					</TooltipTrigger>

					<TooltipContent
						side='top'
						align='center'
					>
						<span>Put call on hold</span>
					</TooltipContent>
				</Tooltip>
			</div>

			<div className='flex items-center gap-1.5'>
				{Object.keys(conferenceParticipants ?? {}).length > 2 && (
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size='icon'
								onClick={() => {
									removeConferenceParticipant(conference?.sid ?? '', conference?.participants.worker);
									removeParticipantByName('worker');
									wrapUpTask?.mutate('Transfered');
								}}
							>
								<ArrowRightFromLine />
								<span className='sr-only'>Leave Call</span>
							</Button>
						</TooltipTrigger>

						<TooltipContent
							side='top'
							align='center'
						>
							<span>Leave Call</span>
						</TooltipContent>
					</Tooltip>
				)}

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant='destructive'
							size='icon'
							onClick={() => endConference?.()}
						>
							<Phone className='rotate-[135deg]' />
						</Button>
					</TooltipTrigger>

					<TooltipContent
						side='top'
						align='center'
					>
						<span>End Call</span>
					</TooltipContent>
				</Tooltip>
			</div>
		</CardFooter>
	);
};

export default ActiveCallFooter;
