'use client';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import Timer from '../timer';
import { useTransition } from 'react';
import { Task } from 'twilio-taskrouter';

type Props = {
	task: Task;
	timer: {
		seconds: number;
		minutes: number;
		hours: number;
	};
};

const TaskWrapup = ({ task, timer }: Props) => {
	const [isPending, startTransition] = useTransition();

	return (
		<Card>
			<CardHeader className='flex-row items-center p-3 gap-12 border-b'>
				<CardTitle className='text-lg'>Wrapping</CardTitle>

				<CardDescription>
					<Timer timer={timer} />

					<Button
						variant='ghost'
						size='icon'
						className='p-0 w-9 h-9'
						type='submit'
						onClick={() => {
							startTransition(async () => {
								await task?.complete('completed');
								toast.dismiss(task?.sid);
							});
						}}
					>
						<X className='h-3.5 w-3.5 inline-block text-gray-400 cursor-pointer' />
					</Button>
				</CardDescription>
			</CardHeader>
		</Card>
	);
};

export default TaskWrapup;
