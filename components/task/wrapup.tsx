'use client';
import { useEffect, useState, useTransition } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { updateTask } from '@/lib/twilio/taskrouter/helpers';
import { Rocket, X } from 'lucide-react';
import { Button } from '../ui/button';

type Props = {
	taskSid: string;
	dateUpdated: Date;
};

const TaskWrapup = ({ taskSid, dateUpdated }: Props) => {
	const [pending, startTransition] = useTransition();
	const [seconds, setSeconds] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [hours, setHours] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			const time = Date.now() - dateUpdated.getTime();

			const m = Math.floor((time / 1000 / 60) % 60);

			if (m >= 3) {
				startTransition(async () => {
					toast.dismiss(taskSid);
					await updateTask(taskSid, { assignmentStatus: 'completed', reason: 'Automatically wrapped up' });
				});
				return;
			}

			const h = Math.floor((time / (1000 * 60 * 60)) % 24);
			const s = Math.floor((time / 1000) % 60);

			setHours(h);
			setMinutes(m);
			setSeconds(s);
		}, 1000);

		return () => clearInterval(interval);
	}, [dateUpdated, taskSid]);

	return (
		<Card className='w-[356px]'>
			<CardHeader className='flex-row items-center p-3 gap-12 border-b'>
				<CardTitle>
					<Rocket className='h-3.5 w-3.5 inline-block mr-1.5 text-yellow-400' />
					<span className='text-sm font-normal'>hey</span>
				</CardTitle>

				<CardDescription>
					<span className='text-xs tabular-nums'>
						{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
					</span>
					Incoming call
					<Button
						variant='ghost'
						size='icon'
						className='p-0 w-8 h-8'
						onClick={() => {
							startTransition(async () => {
								await updateTask(taskSid, { assignmentStatus: 'completed' });
								toast.dismiss(taskSid);
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
