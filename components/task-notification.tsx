'use client';
import { useState } from 'react';
import { Reservation, Task } from 'twilio-taskrouter';
import IncomingTask from './incoming-task';
import { ActiveCall } from './active-call';
import TaskWrapup from './task/wrapup';
import useTimer from '@/hooks/useTimer';
import { TaskContext } from './active-call/context';
import OutboundTask from './outbound-task';
import VoicemailTask from './voicemail-task';
import { SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';
type Props = {
	reservation: Reservation;
	task: Task;
	isCollapsed?: boolean;
	side?: 'right' | 'top' | 'bottom' | 'left';
	align?: 'center' | 'end' | 'start';
};

const TaskNotification = ({ reservation, task, isCollapsed, side = 'right', align = 'start' }: Props) => {
	'use no memo'; // opts out this component from being compiled by React Compiler
	// const [open, setOpen] = useState(reservation.status === 'pending' && task.attributes.direction !== 'outboundDial');
	// const { attributes } = task;
	const timer = useTimer(task.dateUpdated);
	// const isInbound = task.attributes.direction === 'inbound';

	const isVoicemail = task.attributes.taskType === 'voicemail';
	const taskChannelUniqueName = task.taskChannelUniqueName;

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<SidebarMenuItem>
					<SidebarMenuButton
						// variant='secondary'
						// size={isCollapsed ? 'icon' : 'default'}
						size='sm'
						className={cn('animate-pulse')}
					>
						{taskChannelUniqueName === 'default' && isVoicemail && (
							<Voicemail className={cn(!isCollapsed && 'mr-1.5')} />
						)}
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
					</SidebarMenuButton>
				</SidebarMenuItem>
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
			</div>
		</TaskContext>
	);
};

export default TaskNotification;
