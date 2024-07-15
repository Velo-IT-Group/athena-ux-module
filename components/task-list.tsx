'use client';
import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWorker } from '@/providers/worker-provider';
import { Plus } from 'lucide-react';

type Props = {
	className?: String;
};

const TaskList = ({ className }: Props) => {
	const { worker } = useWorker();

	return (
		<section className='space-y-1.5 px-1.5'>
			<h2 className='text-sm text-muted-foreground'>Tasks</h2>

			<div className='space-y-1.5'>
				{worker &&
					worker.reservations.size > 0 &&
					Array.from(worker?.reservations?.values()).map((reservation) => (
						<div
							key={reservation.sid}
							className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), '')}
						>
							<span className='bg-muted rounded-sm h-8 w-8 grid place-items-center'>🚀</span>

							<h3 className='text-muted-foreground flex items-center gap-1.5 font-medium'>
								{reservation.task.attributes.call_sid}
							</h3>
						</div>
					))}
			</div>

			<Button
				variant='ghost'
				size='sm'
				className='w-full justify-start'
			>
				<Plus className='mr-1.5' /> New task
			</Button>
		</section>
	);
};

export default TaskList;
