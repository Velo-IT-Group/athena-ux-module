'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Reservation, Task } from 'twilio-taskrouter';
import IncomingTask from './incoming-task';
import { ActiveCall } from './active-call';
import TaskWrapup from './task/wrapup';
import useTimer from '@/hooks/useTimer';
import { TaskContext } from './active-call/context';
import OutboundTask from './outbound-task';
import { MessageSquareText, Phone, Voicemail } from 'lucide-react';
import { cn } from '@/lib/utils';
import VoicemailTask from './voicemail-task';
type Props = {
	reservation: Reservation;
	task: Task;
	isCollapsed?: boolean;
};

const TaskNotification = ({ reservation, task, isCollapsed }: Props) => {
	'use no memo'; // opts out this component from being compiled by React Compiler
	const [open, setOpen] = useState(reservation.status === 'pending' && task.attributes.direction !== 'outboundDial');
	const { attributes } = task;
	const timer = useTimer(task.dateUpdated);

	const isVoicemail = task.attributes.taskType === 'voicemail';
	const taskChannelUniqueName = task.taskChannelUniqueName;

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<Button
					variant='secondary'
					size={isCollapsed ? 'icon' : 'default'}
					className={cn('animate-pulse', isCollapsed ? 'h-9 w-9' : 'w-full justify-start')}
				>
					{taskChannelUniqueName === 'default' && isVoicemail && <Voicemail className={cn(!isCollapsed && 'mr-1.5')} />}
					{taskChannelUniqueName === 'default' && !isVoicemail && (
						<Phone className={cn('fill-current stroke-none', !isCollapsed && 'mr-1.5')} />
					)}
					{taskChannelUniqueName === 'voice' && isVoicemail && <Voicemail className={cn(!isCollapsed && 'mr-1.5')} />}
					{taskChannelUniqueName === 'voice' && !isVoicemail && (
						<Phone className={cn('fill-current stroke-none', !isCollapsed && 'mr-1.5')} />
					)}
					{taskChannelUniqueName === 'chat' && (
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

					{reservation.status === 'accepted' && taskChannelUniqueName === 'voice' && !isVoicemail && (
						<ActiveCall task={task} />
					)}

					{reservation.status === 'accepted' && isVoicemail && <VoicemailTask task={task} />}

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
