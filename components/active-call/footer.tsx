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
import OutboundDialerContent from '../outbound-dialer-content';
import { useTaskContext } from './context';

const ActiveCallFooter = () => {
	const { transferTask, addExternalParticipant, task, endConference, conferenceParticipants, removeParticipantByName } =
		useTaskContext();
	const { muted, setMuted } = useDevice();

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
									transferTask?.mutate({ to: id as string, options: {} });
								} else {
									addExternalParticipant?.mutate({
										From: task?.attributes.to,
										To: parsePhoneNumber(id as string, 'US', 'E.164').formattedNumber ?? '',
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
					>
						<OutboundDialerContent
							numbers={[]}
							onSubmit={(data) => {
								addExternalParticipant?.mutate({
									From: task?.attributes.to,
									To: parsePhoneNumber(data.get('To') as string, 'US', 'E.164').formattedNumber ?? '',
								});
							}}
						/>
					</PopoverContent>
				</Popover>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant='secondary'
							size='icon'
							onClick={async () => {
								// await task?.hold(task.attributes.workerSid, true);
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
								onClick={() => removeParticipantByName('worker')}
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
