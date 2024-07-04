'use client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowRightToLine, AudioLines, Circle, Ellipsis, Grip, Mic, Pause, Rocket } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialpad } from './dialpad';
import { useJabra } from '@/providers/jabra-provider';
import { useTwilio } from '@/providers/twilio-provider';
import { ParticipantInstance } from 'twilio/lib/rest/api/v2010/account/conference/participant';
import { Combobox } from './ui/combobox';
import { WorkerInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/worker';
import WorkerSelector from '@/app/(user)/worker-selector';

type Props = {
	workers: WorkerInstance[];
};

export function ActiveCall({ workers }: Props) {
	const {} = useJabra();
	const { activeCall } = useTwilio();

	return (
		<>
			{activeCall && (
				<Popover>
					<Card className='fixed bottom-1.5 right-1.5 shadow-sm'>
						<CardHeader className='flex-row items-center justify-between p-3 gap-12 border-b space-y-0'>
							<CardTitle className='space-x-1.5 flex items-center'>
								<Rocket className='h-3.5 w-3.5 inline-block text-yellow-400' />

								<span className='text-sm font-normal'>Customer support</span>

								<span className='text-xs text-muted-foreground tabular-nums'>Test</span>
							</CardTitle>

							{/* <Combobox
								items={workers.map((worker) => {
									return { label: worker.friendlyName, value: `${worker.sid}-${JSON.parse(worker.attributes).email}` };
								})}
								placeholder='Filter workers...'
							/> */}
							<WorkerSelector />

							{/* <Combobox placeholder='' items={[]}>
						<UserPlus className='h-3.5 w-3.5 text-muted-foreground cursor-pointer' />
					</Combobox> */}
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
			)}
		</>
	);
}
