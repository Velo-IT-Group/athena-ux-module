import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { buttonVariants } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getTasks } from '@/lib/manage/read';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

type Props = {
	ticketId: number;
};

const ChildTickets = async ({ ticketId }: Props) => {
	const tasks = await getTasks(ticketId, { conditions: [{ parameter: { childTicketId: 0 }, comparator: '>' }] });
	const completedTasks = tasks.filter((task) => task.closedFlag).length;

	return (
		<Accordion type='multiple'>
			<AccordionItem value='sub-issues'>
				<AccordionTrigger>
					<div className='flex items-center gap-1.5 shrink-0 grow text-xs'>
						<p>Sub-issues</p>

						<Progress
							value={completedTasks}
							max={tasks.length}
							className='max-w-24'
						/>

						<p>
							{completedTasks}/{tasks.length}
						</p>
					</div>
				</AccordionTrigger>

				<AccordionContent className='space-y-0.5 grid'>
					{tasks.map((task) => (
						<Link
							href={`/tickets/${task.id}`}
							className={cn(
								'flex items-center gap-1.5 text-sm',
								buttonVariants({ variant: 'ghost', className: 'justify-start' })
							)}
						>
							<p className='text-muted-foreground'>
								#{task.id} {task.summary}
							</p>
						</Link>
					))}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};

export default ChildTickets;
