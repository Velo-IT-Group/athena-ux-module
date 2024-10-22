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
import { MessageSquareText, Phone, PhoneIncoming, PhoneOutgoing, Voicemail } from 'lucide-react';
import { cn } from '@/lib/utils';
import VoicemailTask from './voicemail-task';
type Props = {
	reservation: Reservation;
	task: Task;
	isCollapsed?: boolean;
	side?: 'right' | 'top' | 'bottom' | 'left';
	align?: 'center' | 'end' | 'start';
};

const TaskNotification = ({ reservation, task, isCollapsed, side = 'right', align = 'start' }: Props) => {
	'use no memo'; // opts out this component from being compiled by React Compiler
	const [open, setOpen] = useState(reservation.status === 'pending' && task.attributes.direction !== 'outboundDial');
	const { attributes } = task;
	const timer = useTimer(task.dateUpdated);
	const isInbound = task.attributes.direction === 'inbound';

	const isVoicemail = task.attributes.taskType === 'voicemail';
	const taskChannelUniqueName = task.taskChannelUniqueName;

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger className='hover:bg-muted transition-colors'>
				<div className='flex items-center gap-1.5 px-1.5 text-xs'>
					{isInbound ? <PhoneIncoming className='w-3 h-3' /> : <PhoneOutgoing className='w-3 h-3' />}

					<span className='whitespace-nowrap overflow-hidden text-ellipsis max-w-36'>{task.attributes.name}</span>
				</div>
			</PopoverTrigger>

			<TaskContext task={task}>
				<PopoverContent
					side={side}
					align={align}
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
