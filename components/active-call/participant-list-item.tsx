'use client';
import React from 'react';
import { Button, buttonVariants } from '../ui/button';
import { CircleMinus, Pause, Phone, Play, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import useConferenceParticipant from '@/hooks/useConferenceParticipant';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Skeleton } from '../ui/skeleton';

type Props = { conferenceSid: string; sid: string; name: string; isYou: boolean; showRemoval: boolean };

const ParticipantListItem = ({ conferenceSid, sid, name, isYou, showRemoval }: Props) => {
	const { isMuted, isOnHold, toggleParticipantMute, removeParticipant, toggleParticipantHoldState, getParticipant } =
		useConferenceParticipant({
			conferenceSid,
			participantSid: sid,
		});

	const { data: participant, isLoading } = getParticipant;

	if (isLoading) return <Skeleton className='h-9 w-full' />;

	return (
		<div
			className={cn(
				buttonVariants({ variant: participant?.hold ? 'secondary' : 'ghost', size: 'sm' }),
				'flex items-center justify-between h-9 hover:bg-transparent relative',
				participant?.hold && 'opacity-50'
			)}
		>
			<div className='mr-1.5 relative'>
				<User />
			</div>

			<p className='text-sm'>
				{name} {isYou && <span className='text-xs font-medium'>You</span>}
			</p>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant='ghost'
						size='icon'
						className='ml-auto'
						onClick={() =>
							toggleParticipantHoldState.mutate({ hold: participant?.hold !== undefined ? !participant?.hold : true })
						}
					>
						{participant?.hold ? <Play /> : <Pause />}
					</Button>
				</TooltipTrigger>

				<TooltipContent>{participant?.hold ? 'Remove From Hold' : 'Put On Hold'}</TooltipContent>
			</Tooltip>

			{showRemoval && (
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
						>
							<CircleMinus />
						</Button>
					</TooltipTrigger>

					<TooltipContent>Remove</TooltipContent>
				</Tooltip>
			)}
		</div>
	);
};

export default ParticipantListItem;
