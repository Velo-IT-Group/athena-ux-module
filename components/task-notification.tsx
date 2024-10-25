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
		<TaskContext task={task}>
			<div className='min-h-12 max-h-96 h-full flex flex-col bg-muted p-3'>
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
