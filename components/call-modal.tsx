'use client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowRightToLine, AudioLines, Circle, Ellipsis, Grip, Mic, Pause, Rocket, UserPlus } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Task } from 'twilio-taskrouter';
import { CustomTaskAttributes } from '@/types/twilio';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialpad } from './dialpad';
import { useJabra } from '@/providers/jabra-provider';
import { MuteState } from '@gnaudio/jabra-js';

type Props = {
	task: Task & { attributes: CustomTaskAttributes };
};

export function ActiveCall({ task }: Props) {
	const { deviceState } = useJabra();
	return (
		<Popover>
			<Card className='fixed bottom-1.5 right-1.5 shadow-sm'>
				<CardHeader className='flex-row items-center justify-between p-3 gap-12 border-b space-y-0'>
					<CardTitle className='space-x-1.5 flex items-center'>
						<Rocket className='h-3.5 w-3.5 inline-block text-yellow-400' />
						<span className='text-sm font-normal'>Customer support</span>
						<span className='text-xs text-muted-foreground tabular-nums'>12:37</span>
					</CardTitle>

					<UserPlus className='h-3.5 w-3.5 text-muted-foreground cursor-pointer' />
				</CardHeader>

				<CardContent className='p-3 space-y-4'>
					<div className='space-y-2'>
						<div className='flex items-center space-x-2'>
							<Avatar className='h-auto w-auto'>
								<AvatarFallback className='text-xs p-1.5'>AS</AvatarFallback>
							</Avatar>

							<span className='text-sm font-normal'>
								Amy Smith <span className='text-muted-foreground text-xs'>You</span>{' '}
								<AudioLines className='w-3.5 h-3.5 inline text-green-500' />
							</span>
						</div>

						<div className='flex items-center space-x-2'>
							<Avatar className='h-auto w-auto'>
								<AvatarFallback className='text-xs p-1.5'>BC</AvatarFallback>
							</Avatar>
							<span className='text-sm font-normal'>Betty Cooper</span>
						</div>
					</div>
				</CardContent>

				<CardFooter className='p-3 border-t space-x-1.5'>
					<Button
						variant={deviceState.muteState === MuteState.MUTED ? 'destructive' : 'accepting'}
						size='sm'
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
