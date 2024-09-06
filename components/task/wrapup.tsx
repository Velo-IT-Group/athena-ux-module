'use client';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import Timer from '../timer';
import { Task } from 'twilio-taskrouter';
import { useMutation } from '@tanstack/react-query';
import { PopoverClose } from '@radix-ui/react-popover';

type Props = {
	task: Task;
	timer: {
		seconds: number;
		minutes: number;
		hours: number;
	};
};

const TaskWrapup = ({ task, timer }: Props) => {
	const completeTaskMutation = useMutation({
		mutationKey: ['completeTask'],
		mutationFn: async () => {
			await task?.complete('completed');
		},
	});

	return (
		<Card>
			<CardHeader className='flex-row items-center p-3 gap-12 border-b'>
				<CardTitle className='text-lg'>Wrapping</CardTitle>

				<CardDescription>
					<Timer timer={timer} />

					<PopoverClose asChild>
						<Button
							variant='ghost'
							size='icon'
							className='p-0 w-9 h-9'
						>
							<X className='h-3.5 w-3.5 inline-block text-gray-400 cursor-pointer' />
						</Button>
					</PopoverClose>
				</CardDescription>
			</CardHeader>

			<CardFooter>
				<Button onClick={() => completeTaskMutation.mutate()}>Complete</Button>
			</CardFooter>
		</Card>
	);
};

export default TaskWrapup;
