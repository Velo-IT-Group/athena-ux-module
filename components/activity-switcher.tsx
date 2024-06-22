'use client';
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from '@/lib/utils';
import { Circle } from 'lucide-react';
import { useTwilio } from '@/providers/twilio-provider';
import { ActivityInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/activity';

type Props = {
	activites: ActivityInstance[];
};

const ActivitySwitcher = ({ activites }: Props) => {
	const { worker, client } = useTwilio();
	const [selectedAccount, setSelectedAccount] = React.useState<string>(worker?.activitySid || '');

	useEffect(() => {
		if (!selectedAccount) return;
	}, [selectedAccount]);

	return (
		<Select
			defaultValue={selectedAccount}
			onValueChange={(e) => {
				setSelectedAccount(e);
			}}
		>
			<SelectTrigger
				className={cn(
					'flex items-center gap-1.5 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0'
				)}
				aria-label='Select service'
			>
				<SelectValue placeholder='Select a service...'>
					<Circle
						className={cn(
							'w-3.5 h-3.5',
							activites.find((account) => account.sid === selectedAccount)?.available
								? 'fill-green-500 stroke-green-500'
								: 'fill-red-500 stroke-red-500'
						)}
					/>
					{/* {activites.find((account) => account.name === selectedAccount)?.available ?  :} */}
					<span className={cn('ml-1.5')}>
						{activites.find((account) => account.sid === selectedAccount)?.friendlyName}
					</span>
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{activites.map((activity) => (
					<SelectItem
						key={activity.sid}
						value={activity.sid}
					>
						<div className='flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground'>
							<Circle
								className={cn(
									'w-3.5 h-3.5',
									activity.available ? 'fill-green-500 stroke-green-500' : 'fill-red-500 stroke-red-500'
								)}
							/>
							{activity.friendlyName}
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default ActivitySwitcher;
