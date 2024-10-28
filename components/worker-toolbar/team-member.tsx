import { Circle, Smartphone, User, Voicemail } from 'lucide-react';
import React from 'react';
import { Task, Worker } from 'twilio-taskrouter';
import { activityColors } from '../activity-item';
import { Separator } from '../ui/separator';
import useTimer from '@/hooks/useTimer';
import Timer from '../timer';
import { cn } from '@/lib/utils';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { relative } from 'path';
import { relativeDate } from '@/utils/date';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

type Props = {
	worker: Worker;
	tasks?: TaskInstance[];
};

const TeamMember = ({ worker, tasks }: Props) => {
	const timer = useTimer(worker.dateActivityChanged);
	return (
		<div className='flex items-center justify-start gap-3 rounded-lg border bg-background p-3 w-full'>
			{/* <div className='h-6 w-6 shrink-0 rounded-full border border-border/15 bg-muted grid place-items-center'>
				<User />
			</div> */}

			<div className='grid gap-0.5'>
				<div className='flex w-full items-center justify-start gap-x-1.5 text-sm font-medium gap-1.5 text-nowrap'>
					<p>{worker.attributes.full_name}</p>

					<Separator
						className='h-3.5'
						orientation='vertical'
					/>

					<p className='flex items-center gap-1'>
						{/* @ts-ignore */}
						<Circle className={cn('stroke-none fill-none rounded-full h-2 w-2', activityColors[worker.activityName])} />
						{/* @ts-ignore */}
						<span>{worker.activityName}</span>
					</p>

					<Separator
						className='h-3.5'
						orientation='vertical'
					/>

					<Timer
						timer={timer}
						className='text-xs'
					/>
				</div>

				{tasks?.map((task) => {
					const parsedAttributes = JSON.parse(task.attributes) as Record<string, any>;
					const voiceTasks = ['default', 'voice'];
					const isVoicemail = parsedAttributes.taskType === 'voicemail';
					return (
						<Accordion
							key={task.sid}
							type='multiple'
							className='w-full grow'
						>
							<AccordionItem
								value={task.sid}
								className='w-full'
							>
								<AccordionTrigger className='w-full'>
									<div className='flex items-center text-xs font-medium gap-1.5 text-nowrap'>
										{voiceTasks.includes(task.taskChannelUniqueName) && !isVoicemail && <Smartphone />}
										{isVoicemail && <Voicemail />}

										<span>{parsedAttributes.name}</span>

										<span>{relativeDate(new Date(task.dateUpdated))}</span>
									</div>
								</AccordionTrigger>

								<AccordionContent></AccordionContent>
							</AccordionItem>
						</Accordion>
					);
				})}
			</div>

			{/* <span className='mt-2 select-none text-sm text-muted-foreground'>{subtitle}</span> */}
		</div>
	);
};

export default TeamMember;
