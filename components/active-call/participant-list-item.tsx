'use client';
import React, { useEffect } from 'react';
import { Button, buttonVariants } from '../ui/button';
import { CircleMinus, Pause, Phone, Play, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import useConferenceParticipant from '@/hooks/useConferenceParticipant';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Skeleton } from '../ui/skeleton';
import { useTaskContext } from './context';

type Props = { sid: string; name: string; isYou: boolean; showRemoval: boolean; nameKey: string };

const ParticipantListItem = ({ sid, name, isYou, showRemoval, nameKey }: Props) => {
	const { conference, removeParticipantByName } = useTaskContext();
	const {
		isMuted,
		isOnHold,
		toggleParticipantMute,
		removeParticipant,
		setIsMuted,
		setIsCoaching,
		isCoaching,
		setIsOnHold,
		setStatus,
		status,
		toggleParticipantHoldState,
		getParticipant,
	} = useConferenceParticipant({
		conferenceSid: conference?.sid ?? '',
		participantSid: sid,
	});

	const { data: participant, isLoading } = getParticipant;

	useEffect(() => {
		if (!participant) return;
		setIsMuted(participant.muted);
		setIsOnHold(participant.hold);
		setStatus(participant.status);
		setIsCoaching(participant.coaching);
	}, [participant]);

	if (isLoading) return <Skeleton className='h-9 w-full' />;

	return (
		<div
			className={cn(
				buttonVariants({ variant: participant?.hold ? 'secondary' : 'ghost', size: 'sm' }),
				'flex items-center justify-between h-9 hover:bg-transparent relative',
				isOnHold && 'opacity-50'
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
							onClick={() => {
								removeParticipant.mutate();
								removeParticipantByName(nameKey);
							}}
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
