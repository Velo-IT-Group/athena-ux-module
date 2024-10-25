'use client';
import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import useSyncMap from '@/hooks/useSyncMap';
import { groupBy } from 'lodash';
import TeamMember from './team-member';

type Props = {
	members: { id: string; name: string }[];
};

const TeamMembers = ({ members }: Props) => {
	const { items } = useSyncMap('');

	const groupedActivities = groupBy(items, (item) => item.data);

	return (
		<ScrollArea className='min-h-12 max-h-96 h-full flex flex-col bg-muted'>
			<div className='flex w-[285px] flex-col items-center justify-center gap-y-3 rounded-xl border py-3 px-1.5'>
				{Object?.entries(groupedActivities).map(([key], index) => (
					<div
						key={`${key}-separator`}
						className='w-full'
					>
						<div
							key={key}
							className='w-full'
						>
							<span className='text-xs font-medium text-muted-foreground ml-1'>{key}</span>
							{members?.map((member) => (
								<TeamMember
									key={member.id}
									title={member.name}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</ScrollArea>
	);
};

export default TeamMembers;
