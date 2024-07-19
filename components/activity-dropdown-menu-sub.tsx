'use client';
import React, { useState } from 'react';
import { DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from './ui/dropdown-menu';
import { Command, CommandGroup, CommandItem, CommandList } from './ui/command';
import { useWorker } from '@/providers/worker-provider';
import { ActivityInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/activity';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
	activities: ActivityInstance[];
};

const ActivityDropdownMenuSub = ({ activities }: Props) => {
	const { worker } = useWorker();
	const [selectedAccount, setSelectedAccount] = useState<string>(worker?.workerActivitySid ?? '');
	const selectedActivity = worker?.activities.get(selectedAccount);

	return (
		<DropdownMenuSub>
			<DropdownMenuSubContent>
				<Command>
					<CommandList>
						<CommandGroup>
							<CommandList>
								{activities.map((activity) => (
									<CommandItem
										key={activity.sid}
										value={activity.sid}
										onSelect={async (currentValue) => {
											try {
												const act = worker?.activities.get(currentValue);
												const activity = await act?.setAsCurrent();
												if (!activity) throw Error('No activity provided...');
												setSelectedAccount(activity.sid);
											} catch (error) {
												console.error(error);
												return;
											}
										}}
									>
										<Check
											className={cn(
												'mr-2 h-4 w-4',
												selectedActivity?.sid === activity.sid ? 'opacity-100' : 'opacity-0'
											)}
										/>

										{activity.friendlyName}
									</CommandItem>
								))}
							</CommandList>
						</CommandGroup>
					</CommandList>
				</Command>
			</DropdownMenuSubContent>

			<DropdownMenuSubTrigger>
				<Circle
					className={cn('stroke-none  mr-1.5', selectedActivity?.available ? 'fill-green-500' : 'fill-red-500')}
				/>
				<span>{selectedActivity?.name}</span>
			</DropdownMenuSubTrigger>
		</DropdownMenuSub>
	);
};

export default ActivityDropdownMenuSub;
