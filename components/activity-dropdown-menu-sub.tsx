'use client';
import React, { useState } from 'react';
import { DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from './ui/dropdown-menu';
import { Command, CommandGroup, CommandItem, CommandList } from './ui/command';
import { useWorker } from '@/providers/worker-provider';
import { ActivityInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/activity';
import { Circle } from 'lucide-react';

type Props = {
	activities: ActivityInstance[];
};

const ActivityDropdownMenuSub = ({ activities }: Props) => {
	const { worker } = useWorker();
	const [selectedAccount, setSelectedAccount] = useState<string>(worker?.workerActivitySid ?? '');
	// const selectedActivity = worker?.activities.get(selectedAccount);

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
									>
										{activity.friendlyName}
									</CommandItem>
								))}
							</CommandList>
						</CommandGroup>
					</CommandList>
				</Command>
			</DropdownMenuSubContent>
			<DropdownMenuSubTrigger>
				<Circle className='mr-1.5' />
			</DropdownMenuSubTrigger>
		</DropdownMenuSub>
	);
};

export default ActivityDropdownMenuSub;
