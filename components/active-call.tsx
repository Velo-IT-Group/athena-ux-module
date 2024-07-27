'use client';
import {
	ArrowRightFromLine,
	Circle,
	Ellipsis,
	Grip,
	Mic,
	MicOff,
	Pause,
	Phone,
	PhoneForwarded,
	Rocket,
	Settings,
	SquareArrowOutUpRight,
	UserPlus,
	X,
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialpad } from './dialpad';
import { ParticipantInstance } from 'twilio/lib/rest/api/v2010/account/conference/participant';
import WorkerSelector from '@/app/(user)/worker-selector';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import ConferenceParticipant from './conference-participant';
import { toast } from 'sonner';
import { getConferenceByName } from '@/lib/twilio/conference/helpers';
import { ConferenceInstance } from 'twilio/lib/rest/api/v2010/account/conference';
import { useRecoilState, useRecoilValue } from 'recoil';
import { callStateAtom } from '@/atoms/twilioStateAtom';
import { CustomCall } from '@/atoms/twilioStateAtom';

export function ActiveCall() {
	const [activeCall, setActiveCall] = useRecoilState(callStateAtom);

	const [conference, setConference] = useState<ConferenceInstance | undefined>(undefined);
	const [participants, setParticipants] = useState<ParticipantInstance[]>(
		activeCall.task?.attributes.conference.participants ?? []
	);
	const [seconds, setSeconds] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [hours, setHours] = useState(0);

	const intialDate = new Date();

	useEffect(() => {
		const interval = setInterval(() => {
			const time = new Date().getTime() - intialDate.getTime();

			const m = Math.floor((time / 1000 / 60) % 60);
			const h = Math.floor((time / (1000 * 60 * 60)) % 24);
			const s = Math.floor((time / 1000) % 60);

			setHours(h);
			setMinutes(m);
			setSeconds(s);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (!conference) {
			getConferenceByName(activeCall.task?.sid!)
				.then((c) => {
					console.log(c);
					setActiveCall((prev: CustomCall) => ({ ...prev, conference: c }));
				})
				.catch((e) => console.error(e));
			return;
		}
		conference?.participants().list().then(setParticipants);
	}, []);

	return (
		<TooltipProvider>
			<Popover>
				<Card className='shadow-sm w-80 dark'>
					<CardHeader className='flex-row items-center justify-between p-3 gap-12 border-b space-y-0'>
						<CardTitle className='space-x-1.5 flex items-center'>
							<Rocket className='inline-block text-yellow-400' />

							<span className='text-sm font-normal'>Customer support</span>

							<span className='text-xs text-muted-foreground tabular-nums'>
								{hours > 0 && `${String(hours).padStart(2, '0')}:`}
								{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
							</span>
						</CardTitle>

						<div className='flex items-center gap-1.5'>
							{activeCall.task && (
								<Link
									href={`/conversations/${activeCall.task?.sid}`}
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

							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant='ghost'
										size='smIcon'
										className='p-0'
										onClick={() => toast.dismiss(activeCall?.task?.attributes?.call_sid)}
									>
										<X />
									</Button>
								</TooltipTrigger>

								<TooltipContent>Dismiss</TooltipContent>
							</Tooltip>
						</div>
					</CardHeader>

					<CardContent className='p-1.5'>
						{/* {Array.from({ length: 5 }).map((_, i) => (
							<ConferenceParticipant
								task={activeCall.task}
								participant={{}}
								key={i}
							/>
						))} */}
						{participants.map((p: ParticipantInstance) => (
							<ConferenceParticipant
								task={activeCall?.task!}
								participant={p}
								key={p.accountSid}
							/>
						))}
					</CardContent>

					<CardFooter className='p-3 border-t space-x-1.5 justify-between'>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant={activeCall.call?.isMuted() ? 'destructive' : 'accepting'}
									size='icon'
									onClick={() => activeCall.call?.mute(!activeCall.call?.isMuted() ?? true)}
								>
									<Mic className='w-3.5 h-3.5' />
								</Button>
							</TooltipTrigger>

							<TooltipContent
								side='top'
								align='center'
							>
								<span>Mute</span>
							</TooltipContent>
						</Tooltip>

						<div className='flex items-center gap-1.5'>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										className='text-red-500 w-9 flex flex-col'
										variant='secondary'
										size='icon'
									>
										<Circle className='w-3 h-3 fill-red-500 text-red-500 animate-pulse' />
										<span className='text-xs'>Rec</span>
									</Button>
								</TooltipTrigger>

								<TooltipContent
									side='top'
									align='center'
								>
									<span>Stop Recording</span>
								</TooltipContent>
							</Tooltip>

							<Tooltip>
								<TooltipTrigger asChild>
									<PopoverTrigger asChild>
										<Button
											variant='secondary'
											size='icon'
										>
											<Grip className='h-3.5 w-3.5' />
										</Button>
									</PopoverTrigger>
								</TooltipTrigger>

								<TooltipContent
									side='top'
									align='center'
								>
									<span>Show Keypad</span>
								</TooltipContent>
							</Tooltip>

							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant='secondary'
										size='icon'
									>
										<Pause className='h-3.5 w-3.5' />
									</Button>
								</TooltipTrigger>

								<TooltipContent
									side='top'
									align='center'
								>
									<span>Put call on hold</span>
								</TooltipContent>
							</Tooltip>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant='secondary'
										size='icon'
									>
										<Ellipsis className='h-3.5 w-3.5' />
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent
									side='top'
									align='end'
									className='w-48 dark'
									avoidCollisions
								>
									<DropdownMenuGroup>
										<DropdownMenuItem>
											<Pause className='mr-3' />
											<span>Hold</span>
										</DropdownMenuItem>

										<DropdownMenuItem>
											<UserPlus className='mr-3' />
											<span>Add People</span>
										</DropdownMenuItem>

										<DropdownMenuItem>
											<PhoneForwarded className='mr-3' />
											<span>Transfer Call</span>
										</DropdownMenuItem>
									</DropdownMenuGroup>

									<DropdownMenuSeparator />

									<DropdownMenuGroup>
										<DropdownMenuItem>
											<MicOff className='mr-3' />
											<span>Mute Mic</span>
										</DropdownMenuItem>

										<DropdownMenuItem>
											<Circle className='mr-3' />
											<span>Record Call</span>
										</DropdownMenuItem>

										<DropdownMenuItem>
											<Grip className='mr-3' />
											<span>Show Keypad</span>
										</DropdownMenuItem>

										<DropdownMenuItem>
											<Settings className='mr-3' />
											<span>Audio Settings</span>
										</DropdownMenuItem>
									</DropdownMenuGroup>

									<DropdownMenuSeparator />

									<DropdownMenuGroup>
										<DropdownMenuItem>
											<ArrowRightFromLine className='mr-3' />
											<span>Leave Call</span>
										</DropdownMenuItem>

										<DropdownMenuItem>
											<Phone className='mr-3 rotate-[135deg] text-red-500' />
											<span>End Call</span>
										</DropdownMenuItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant='destructive'
									size='icon'
									onClick={() => activeCall.call?.disconnect()}
								>
									<Phone className='rotate-[135deg]' />
								</Button>
							</TooltipTrigger>

							<TooltipContent
								side='top'
								align='center'
							>
								<span>End Call</span>
							</TooltipContent>
						</Tooltip>
					</CardFooter>
				</Card>

				<PopoverContent
					side='left'
					className='dark'
					avoidCollisions
				>
					<Dialpad />
				</PopoverContent>
			</Popover>
		</TooltipProvider>
	);
}
