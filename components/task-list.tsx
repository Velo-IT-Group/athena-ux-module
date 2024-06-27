import { SettingsIcon } from 'lucide-react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Task } from 'twilio-taskrouter';

type Props = {
	className?: String;
	tasks?: Task[];
};

const TaskList = ({ className, tasks = [] }: Props) => {
	return (
		<aside className={cn('flex flex-col bg-card h-full p-4', className)}>
			<div className='flex items-center justify-between mb-6'>
				<h2 className='text-xl font-bold'>Conversation</h2>
				<SettingsIcon className='w-6 h-6' />
			</div>

			<div className='mb-4'>
				<p className='text-sm font-medium'>Assigned to you</p>
				<p className='text-sm'>Inbox</p>
			</div>

			<div className='mb-4'>
				<p className='text-sm'>{tasks.length} conversations</p>
			</div>

			<div className='space-y-4'>
				{tasks.map((task) => {
					const firstName = task.attributes['userFirstName'] as string;
					const lastName = task.attributes['userLastName'] as string;
					return (
						<div
							className='flex items-center space-x-4'
							key={task.sid}
						>
							<Avatar>
								<AvatarImage src='/placeholder-user.jpg' />
								<AvatarFallback>
									{firstName[0]}
									{lastName[0]}
								</AvatarFallback>
							</Avatar>

							<div>
								<p className='text-sm font-medium'>
									{firstName} {lastName}
								</p>
								<p className='text-xs text-gray-500'>{task.attributes['from']}</p>
								<p className='text-xs text-gray-500'>{task.dateCreated.getTime()}</p>
							</div>
						</div>
					);
				})}
			</div>

			<Button className='mt-auto w-full'>New conversation</Button>
		</aside>
	);
};

export default TaskList;
