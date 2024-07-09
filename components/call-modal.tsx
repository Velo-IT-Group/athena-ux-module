'use client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
	ArrowRightToLine,
	AudioLines,
	Circle,
	Ellipsis,
	Grip,
	Mic,
	Pause,
	Rocket,
	SquareArrowOutUpRight,
	UserPlus,
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialpad } from './dialpad';
import { CustomCall } from '@/providers/twilio-provider';
import { ParticipantInstance } from 'twilio/lib/rest/api/v2010/account/conference/participant';
import WorkerSelector from '@/app/(user)/worker-selector';
import { Suspense } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Props = {
	activeCall: CustomCall;
};

export function ActiveCall({ activeCall }: Props) {
	console.log(activeCall);

	return (
		<Popover>
			<Card className='shadow-sm'>
				<CardHeader className='flex-row items-center justify-between p-3 gap-12 border-b space-y-0'>
					<CardTitle className='space-x-1.5 flex items-center'>
						<Rocket className='h-3.5 w-3.5 inline-block text-yellow-400' />

						<span className='text-sm font-normal'>Customer support</span>

						<span className='text-xs text-muted-foreground tabular-nums'>0:00</span>
					</CardTitle>

					{activeCall?.task && (
						<Link
							href={`/conversations/${activeCall?.task?.sid}`}
							className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
						>
							<Button
								variant='ghost'
								size='icon'
								className='p-0 w-8 h-8'
							>
								<SquareArrowOutUpRight className='text-muted-foreground' />
							</Button>
						</Link>
					)}

					<Suspense
						fallback={
							<Button
								variant='ghost'
								size='icon'
								className='p-0 w-8 h-8'
							>
								<UserPlus className='text-muted-foreground cursor-pointer' />
							</Button>
						}
					>
						<WorkerSelector />
					</Suspense>
				</CardHeader>

				<CardContent className='p-3 space-y-4'>
					<div className='space-y-2'>
						{activeCall &&
							activeCall.conference &&
							Object.values(activeCall?.conference?.participants).map((p: ParticipantInstance) => (
								<div
									className='flex items-center space-x-2'
									key={p.accountSid}
								>
									<Avatar className='h-auto w-auto'>
										<AvatarFallback className='text-xs p-1.5'>{p.accountSid}</AvatarFallback>
									</Avatar>

									<span className='text-sm font-normal'>
										Amy Smith <span className='text-muted-foreground text-xs'>You</span>{' '}
										<AudioLines className='w-3.5 h-3.5 inline text-green-500' />
									</span>
								</div>
							))}

						{/* <div className='flex items-center space-x-2'>
									<Avatar className='h-auto w-auto'>
										<AvatarFallback className='text-xs p-1.5'>BC</AvatarFallback>
									</Avatar>
									<span className='text-sm font-normal'>Betty Cooper</span>
								</div> */}
					</div>
				</CardContent>

				<CardFooter className='p-3 border-t space-x-1.5'>
					<Button
						variant={activeCall?.call?.isMuted() ? 'destructive' : 'accepting'}
						size='sm'
						onClick={() => activeCall?.call?.mute(!activeCall?.call?.isMuted() ?? true)}
					>
						<Mic className='w-3.5 h-3.5' />
					</Button>

					<Button
						className='text-red-500 w-9'
						variant='secondary'
						size='sm'
					>
						<Circle className='h-9 w-9 fill-red-500 text-red-500 animate-pulse' />
					</Button>

					<PopoverTrigger asChild>
						<Button
							variant='secondary'
							size='sm'
						>
							<Grip className='h-3.5 w-3.5' />
						</Button>
					</PopoverTrigger>

					<Button
						variant='secondary'
						size='sm'
					>
						<Pause className='h-3.5 w-3.5' />
					</Button>

					<Button
						variant='secondary'
						size='sm'
					>
						<Ellipsis className='h-3.5 w-3.5' />
					</Button>

					<Button
						variant='destructive'
						size='sm'
						onClick={() => activeCall?.call?.disconnect()}
					>
						<ArrowRightToLine className='h-3.5 w-3.5' />
					</Button>
				</CardFooter>
			</Card>

			<PopoverContent
				side='left'
				avoidCollisions
			>
				<Dialpad />
			</PopoverContent>
		</Popover>
	);
}
