'use client';
import { startTransition, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Reservation, Task } from 'twilio-taskrouter';
import IncomingTask from './incoming-task';
import { ActiveCall } from './active-call';
import TaskWrapup from './task/wrapup';
import useTimer from '@/hooks/useTimer';
import { toast } from 'sonner';
import { TaskContext } from './active-call/context';
import OutboundTask from './outbound-task';
import { MessageSquareText, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
	reservation: Reservation;
	task: Task;
	isCollapsed?: boolean;
};

const TaskNotification = ({ reservation, task, isCollapsed }: Props) => {
	const [open, setOpen] = useState(reservation.status === 'pending' && task.attributes.direction !== 'outboundDial');
	const { attributes } = task;
	const timer = useTimer(task.dateUpdated);

	if (timer.minutes >= 3 && reservation.status === 'wrapping') {
		console.log('dismissing', timer, reservation.status);
		startTransition(async () => {
			toast.dismiss(task.sid);
			await task.complete('completed');
		});
	}

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
					{reservation.task.taskChannelUniqueName === 'voice' && (
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
