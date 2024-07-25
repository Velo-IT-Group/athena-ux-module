'use client';
import React, { useState } from 'react';
import { DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from './ui/dropdown-menu';
import { Command, CommandGroup, CommandItem, CommandList } from './ui/command';
import { useWorker } from '@/providers/worker-provider';
import { ActivityInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/activity';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Activity } from 'twilio-taskrouter';

type Props = {
	activities: ActivityInstance[];
	selectedAccount: string;
	setSelectedAccount: React.Dispatch<React.SetStateAction<string>>;
	selectedActivity?: Activity;
};

const ActivityDropdownMenuSub = ({ activities, selectedAccount, setSelectedAccount, selectedActivity }: Props) => {
	const { worker } = useWorker();

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
											} catch (error: any) {
												console.error(error);
												toast.error('Failed to set activity', { description: error.message });
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
