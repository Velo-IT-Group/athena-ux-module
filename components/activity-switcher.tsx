'use client';
import React, { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from '@/lib/utils';
import { Activity } from 'twilio-taskrouter';
import { Circle } from 'lucide-react';
import { useTwilio } from '@/providers/twilio-provider';

type Props = {
	activites: Activity[];
};

const ActivitySwitcher = ({ activites }: Props) => {
	const { worker } = useTwilio();
	const [selectedAccount, setSelectedAccount] = React.useState<string>(worker?.activitySid || activites[0].sid);

	useEffect(() => {
		if (!selectedAccount) return;
	}, [selectedAccount]);

	return (
		<Select
			defaultValue={selectedAccount}
			onValueChange={setSelectedAccount}
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
						{activites.find((account) => account.sid === selectedAccount)?.friendly_name}
					</span>
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{activites.map((account) => (
					<SelectItem
						key={account.sid}
						value={account.sid}
					>
						<div className='flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground'>
							<Circle
								className={cn(
									'w-3.5 h-3.5',
									account.available ? 'fill-green-500 stroke-green-500' : 'fill-red-500 stroke-red-500'
								)}
							/>
							{account.friendly_name}
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default ActivitySwitcher;
