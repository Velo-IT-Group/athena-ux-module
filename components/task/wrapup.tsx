'use client';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { Rocket, X } from 'lucide-react';
import { Button } from '../ui/button';
import Timer from '../timer';
import { useTask } from '../active-call/context';
import { useTransition } from 'react';

const TaskWrapup = () => {
	const { task } = useTask();
	const [isPending, startTransition] = useTransition();
	return (
		<form>
			<Card className='w-[356px]'>
				<CardHeader className='flex-row items-center p-3 gap-12 border-b'>
					<CardTitle>
						<Rocket className='h-3.5 w-3.5 inline-block mr-1.5 text-yellow-400' />
						<span className='text-sm font-normal'>hey</span>
					</CardTitle>

					<CardDescription>
						{task?.dateUpdated && <Timer startTime={task?.dateUpdated} />}
						Incoming call
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
		</form>
	);
};

export default TaskWrapup;
