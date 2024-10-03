'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import Timer from '../timer';
import { Task } from 'twilio-taskrouter';
import { PopoverClose } from '@radix-ui/react-popover';
import { useTaskContext } from '../active-call/context';

type Props = {
	task: Task;
	timer: {
		seconds: number;
		minutes: number;
		hours: number;
	};
};

const TaskWrapup = ({ timer }: Props) => {
	const { completeTask } = useTaskContext();

	return (
		<Card>
			<CardHeader className='flex-row justify-between items-center p-3 gap-12 border-b'>
				<CardTitle className='text-lg'>Wrapping</CardTitle>

				<CardDescription>
					<Timer timer={timer} />

					<PopoverClose asChild>
						<Button
							variant='ghost'
							size='icon'
							className='p-0 w-9 h-9'
						>
							<X className='inline-block text-gray-400 cursor-pointer' />
						</Button>
					</PopoverClose>
				</CardDescription>
			</CardHeader>

			<CardContent className='p-3 pt-1.5'>
				<Button
					className='w-full'
					onClick={() => completeTask?.mutate()}
				>
					Complete
				</Button>
			</CardContent>
		</Card>
	);
};

export default TaskWrapup;
