'use client';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Pause, Play } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import type { ParticipantInstance } from 'twilio/lib/rest/api/v2010/account/conference/participant';
import type { Task } from 'twilio-taskrouter';
import { useState } from 'react';

type Props = {
	task: Task;
	participant: ParticipantInstance;
};

const ConferenceParticipant = ({ task, participant }: Props) => {
	const [hold, setHold] = useState(false);

	return (
		<Button
			variant='ghost'
			size='sm'
			className='flex items-center space-x-1.5 w-full justify-start group'
		>
			<Avatar className='h-auto w-auto'>
				<AvatarFallback className='text-xs p-1.5'>BC</AvatarFallback>
				{participant.hold && (
					<div className={'absolute bg-background/25 w-full h-full grid place-items-center backdrop-blur-[1px]'}>
						<Pause />
					</div>
				)}
			</Avatar>

			<span className='text-sm font-normal'>{participant.label}</span>

			{participant.accountSid === '' && <span className='text-xs text-muted-foreground'>You</span>}

			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant='ghost'
						size='smIcon'
						className='opacity-0 group-hover:opacity-100'
						onClick={() => {
							task.hold(participant.accountSid, !hold).then(() => setHold(!hold));
						}}
					>
						{participant.hold ? <Play /> : <Pause />}
					</Button>
				</TooltipTrigger>

				<TooltipContent>{participant.hold ? 'Resume' : 'Pause'}</TooltipContent>
			</Tooltip>
		</Button>
	);
};

export default ConferenceParticipant;
