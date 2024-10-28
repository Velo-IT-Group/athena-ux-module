'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Compass, Smartphone, X } from 'lucide-react';
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
		<div className='grid gap-3'>
			<div className='grid gap-3 rounded-lg border bg-background p-3 w-full'>
				<div className='flex w-full items-center justify-start gap-x-2'>
					<div className='h-6 w-6 shrink-0 rounded-full border border-border/15 bg-[#FE9300] '></div>

					<span className='select-none text-sm font-medium'>Jonas</span>

					<Smartphone />

					<Compass />
				</div>

				<span className='select-none text-sm text-muted-foreground'>Call Details </span>
			</div>

			<Button
				variant='outline'
				size='sm'
				className='w-full'
				onClick={() => completeTask?.mutate()}
			>
				Complete
			</Button>
		</div>
	);
};

export default TaskWrapup;
