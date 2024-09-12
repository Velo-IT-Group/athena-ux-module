'use client';
import { CardHeader, CardTitle } from '../ui/card';
import { Rocket, SquareArrowOutUpRight, X } from 'lucide-react';
import { Button, buttonVariants } from '../ui/button';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import Timer from '../timer';
import useTimer from '@/hooks/useTimer';
import { PopoverClose } from '@radix-ui/react-popover';

type Props = {
	queueName: string;
	searchParams: URLSearchParams;
};

const ActiveCallHeader = ({ queueName, searchParams }: Props) => {
	const timer = useTimer(new Date());

	return (
		<CardHeader className='flex-row items-center justify-between p-3 gap-3 border-b space-y-0'>
			<CardTitle className='space-x-1.5 flex items-center'>
				<Rocket className='inline-block text-yellow-400' />

				<span className='text-sm font-normal'>{queueName}</span>

				<Timer timer={timer} />
			</CardTitle>

			<div className='flex items-center gap-1.5'>
				<Link
					href={`/?${searchParams.toString()}`}
					className={buttonVariants({
						variant: 'ghost',
						size: 'icon',
						className: 'p-0 w-9 h-9',
					})}
				>
					<SquareArrowOutUpRight className='text-muted-foreground' />
				</Link>

				<Tooltip>
					<TooltipTrigger asChild>
						<PopoverClose asChild>
							<Button
								variant='ghost'
								size='smIcon'
							>
								<X />
							</Button>
						</PopoverClose>
					</TooltipTrigger>

					<TooltipContent>Dismiss</TooltipContent>
				</Tooltip>
			</div>
		</CardHeader>
	);
};

export default ActiveCallHeader;
