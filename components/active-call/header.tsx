'use client';
import { useState } from 'react';
import { CardHeader, CardTitle } from '../ui/card';
import { Rocket, SquareArrowOutUpRight, X } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import WorkerSelector from '@/app/(user)/worker-selector';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { toast } from 'sonner';
import Timer from '../timer';
import { useTask } from './context';

const ActiveCallHeader = () => {
	const { task } = useTask();
	const intialDate = new Date();

	let searchParams = new URLSearchParams();
	if (task?.attributes.contactId) {
		searchParams.set('contactId', task.attributes.contactId);
	}
	if (task?.attributes.companyId) {
		searchParams.set('companyId', task.attributes.companyId);
	}

	return (
		<CardHeader className='flex-row items-center justify-between p-3 gap-3 border-b space-y-0'>
			<CardTitle className='space-x-1.5 flex items-center'>
				<Rocket className='inline-block text-yellow-400' />

				<span className='text-sm font-normal'>{task?.queueName}</span>

				<Timer startTime={intialDate} />
			</CardTitle>

			<div className='flex items-center gap-1.5'>
				<Link href={`/?${searchParams.toString()}`}>
					<Button
						variant='ghost'
						size='icon'
						className='p-0 w-9 h-9'
					>
						<SquareArrowOutUpRight className='text-muted-foreground' />
					</Button>
				</Link>

				<WorkerSelector />

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant='ghost'
							size='smIcon'
							className='p-0'
							onClick={() => toast.dismiss(task?.sid)}
						>
							<X />
						</Button>
					</TooltipTrigger>

					<TooltipContent>Dismiss</TooltipContent>
				</Tooltip>
			</div>
		</CardHeader>
	);
};

export default ActiveCallHeader;
