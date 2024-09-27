'use client';
import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Reservation, Task } from 'twilio-taskrouter';
import IncomingTask from './incoming-task';
import { ActiveCall } from './active-call';
import TaskWrapup from './task/wrapup';
import useTimer from '@/hooks/useTimer';
import { TaskContext, useTaskContext } from './active-call/context';
import OutboundTask from './outbound-task';
import { MessageSquareText, Phone, Voicemail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDevice } from '@/providers/device-provider';
import { SignalType } from '@gnaudio/jabra-js';

type Props = {
	reservation: Reservation;
	task: Task;
	isCollapsed?: boolean;
};

const TaskNotification = ({ reservation, task, isCollapsed }: Props) => {
	const { currentCallControl } = useDevice();
	const [open, setOpen] = useState(reservation.status === 'pending' && task.attributes.direction !== 'outboundDial');
	const { attributes } = task;
	const timer = useTimer(task.dateUpdated);
	const { completeTask } = useTaskContext();
	const [isPending, startTransition] = useTransition();

	const acceptedStatuses = ['pending', 'accepted'];

	if (timer.minutes >= 5 && !acceptedStatuses.includes(reservation.status)) {
		// console.log('dismissing', timer, reservation.status);

		startTransition(async () => {
			await task.complete('Automatically wrapped up');
		});
	}

	useEffect(() => {
		if (!currentCallControl) return;
		currentCallControl?.deviceSignals.subscribe(async (d) => {
			if (d.type === SignalType.HOOK_SWITCH) {
				await reservation?.conference({
					beep: false,
					endConferenceOnExit: false,
					endConferenceOnCustomerExit: true,
				});
			}
		});
	}, [currentCallControl]);

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger
				key={reservation.task.sid}
				asChild
			>
				<Button
					variant='secondary'
					size='icon'
					className='h-9 w-9 animate-pulse'
					key={reservation.task.sid}
				>
					{reservation.task.taskChannelUniqueName === 'default' && (
						<Phone className={cn('fill-current stroke-none', !isCollapsed && 'mr-1.5')} />
					)}
					{reservation.task.taskChannelUniqueName === 'voice' &&
						reservation.task.attributes.taskType === 'voicemail' && (
							<Voicemail className={cn(!isCollapsed && 'mr-1.5')} />
						)}
					{reservation.task.taskChannelUniqueName === 'voice' &&
						reservation.task.attributes.taskType !== 'voicemail' && (
							<Phone className={cn('fill-current stroke-none', !isCollapsed && 'mr-1.5')} />
						)}
					{reservation.task.taskChannelUniqueName === 'chat' && (
						<MessageSquareText className={cn('fill-current stroke-none', !isCollapsed && 'mr-1.5')} />
					)}

					<span className={isCollapsed ? 'sr-only' : 'text-muted-foreground flex items-center gap-1.5 font-medium'}>
						{attributes.name ?? attributes.from}
					</span>
				</Button>
			</PopoverTrigger>

			<TaskContext task={task}>
				<PopoverContent
					side='right'
					align='start'
					sideOffset={12}
					className='p-0'
				>
					{reservation.status === 'pending' && task.attributes.direction === 'outbound' && (
						<OutboundTask
							reservation={reservation}
							task={task}
						/>
					)}

					{reservation.status === 'pending' && task.attributes.direction !== 'outbound' && (
						<IncomingTask
							reservation={reservation}
							task={task}
						/>
					)}

					{reservation.status === 'accepted' &&
						(task.taskChannelUniqueName === 'voice' || task.taskChannelUniqueName === 'default') && (
							<ActiveCall task={task} />
						)}

					{reservation.status === 'wrapping' && (
						<TaskWrapup
							task={task}
							timer={timer}
						/>
					)}
				</PopoverContent>
			</TaskContext>
		</Popover>
	);
};

export default TaskNotification;
