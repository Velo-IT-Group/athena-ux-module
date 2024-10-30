'use client';
import React, { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import useSyncMap from '@/hooks/useSyncMap';
import { groupBy } from 'lodash';
import TeamMember from './team-member';
import { useTwilio } from '@/providers/twilio-provider';
import { useQuery } from '@tanstack/react-query';
import { Worker } from 'twilio-taskrouter';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { Input } from '../ui/input';

type Props = {};

const TeamMembers = ({}: Props) => {
	const [value, setValue] = useState('');
	const { items } = useSyncMap('MP9abacbde4fd4596b44349cef33f53fb3');
	const { workspace } = useTwilio();

	const { data, isLoading } = useQuery<Worker[]>({
		queryKey: ['workers'],
		queryFn: async () => {
			const workerMap = await workspace?.fetchWorkers();
			const workerArray = Array.from(workerMap?.values() ?? []);
			return workerArray;
		},
	});

	if (isLoading) return null;

	// console.log(items);

	// @ts-ignore
	const groupedActivities = groupBy(data, (item) => item?.activityName);

	return (
		<ScrollArea className='min-h-12 max-h-96 h-full flex flex-col bg-muted'>
			{/* <Input
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/> */}

			<div className='flex w-[285px] flex-col items-center justify-center gap-y-3 rounded-xl border py-3 px-1.5'>
				{Object?.entries(groupedActivities).map(([key, value], index) => (
					<div
						key={`${key}-separator`}
						className='w-full'
					>
						<div
							key={key}
							className='w-full'
						>
							<span className='text-xs font-medium text-muted-foreground ml-1'>{key}</span>
							{value?.map((worker) => (
								<TeamMember
									key={worker.sid}
									worker={worker}
									tasks={items.map((i) => i.data as TaskInstance)}
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
