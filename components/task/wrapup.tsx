import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { updateTask } from '@/lib/twilio/taskrouter/helpers';
import { Rocket, X } from 'lucide-react';
import { Button } from '../ui/button';
import Timer from '../timer';

type Props = {
	taskSid: string;
	dateUpdated: Date;
};

const TaskWrapup = ({ taskSid, dateUpdated }: Props) => {
	return (
		<form
			action={async () => {
				('use server');
				await updateTask(taskSid, { assignmentStatus: 'completed' });
				toast.dismiss(taskSid);
			}}
		>
			<Card className='w-[356px]'>
				<CardHeader className='flex-row items-center p-3 gap-12 border-b'>
					<CardTitle>
						<Rocket className='h-3.5 w-3.5 inline-block mr-1.5 text-yellow-400' />
						<span className='text-sm font-normal'>hey</span>
					</CardTitle>

					<CardDescription>
						<Timer startTime={dateUpdated} />
						Incoming call
						<Button
							variant='ghost'
							size='icon'
							className='p-0 w-8 h-8'
							type='submit'
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
