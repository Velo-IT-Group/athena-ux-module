import { getTask } from '@/lib/twilio/taskrouter/helpers';
import React, { Suspense } from 'react';
import { PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';
import IncomingTask from './incoming-call';
import { Skeleton } from './ui/skeleton';
import { ReservationInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/worker/reservation';

type Props = {
	reservation: ReservationInstance;
};

const ServerTaskListItem = async ({ reservation }: Props) => {
	const task = await getTask(reservation.taskSid);

	return (
		<Suspense fallback={<Skeleton className={buttonVariants({ variant: 'secondary', size: 'sm' })} />}>
			<PopoverTrigger
				key={reservation.taskSid}
				className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'w-full shrink overflow-hidden justify-start')}
			>
				<span className='bg-muted rounded-sm h-8 w-8 grid place-items-center'>
					{task.taskChannelUniqueName === 'voice' && '📞'}
					{task.taskChannelUniqueName === 'chat' && '💬'}
					{task.taskChannelUniqueName === 'chat' && ''}
				</span>

				<h3 className='text-muted-foreground flex items-center gap-1.5 font-medium'>{task.attributes.name}</h3>
			</PopoverTrigger>

			<PopoverContent
				side='right'
				align='center'
				className='p-0'
			>
				<IncomingTask
					reservation={reservation}
					task={task}
				/>
			</PopoverContent>
		</Suspense>
	);
};

export default ServerTaskListItem;
