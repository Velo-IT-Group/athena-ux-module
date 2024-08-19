'use client';
import { DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from './ui/dropdown-menu';
import { Command, CommandGroup, CommandItem, CommandList } from './ui/command';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useWorker } from '@/providers/worker-provider';
import { useEffect, useState } from 'react';
import { Activity } from 'twilio-taskrouter';

type Props = {};

const ActivityDropdownMenuSub = ({}: Props) => {
	const { worker } = useWorker();
	const [currentActivity, setCurrentActivity] = useState<Activity | undefined>(undefined);

	useEffect(() => {
		setCurrentActivity(worker?.activity);

		return () => {
			setCurrentActivity(undefined);
		};
	}, [worker?.activity]);

	return (
		<DropdownMenuSub>
			<DropdownMenuSubContent>
				<Command>
					<CommandList>
						<CommandGroup>
							<CommandList>
								{Array.from(worker?.activities.entries() || []).map(([sid, activity]) => (
									<CommandItem
										key={sid}
										value={sid}
										onSelect={async (currentValue) => {
											try {
												const act = worker?.activities.get(currentValue);
												const activity = await act?.setAsCurrent();
												if (!activity) throw Error('No activity provided...');
												setCurrentActivity(activity);
											} catch (error: any) {
												console.error(error);
												toast.error('Failed to set activity', { description: error.message });
												return;
											}
										}}
									>
										<Check
											className={cn(
												'mr-2 h-3.5 w-3.5',
												activity?.sid === currentActivity?.sid ? 'opacity-100' : 'opacity-0'
											)}
										/>

										{activity.name}
									</CommandItem>
								))}
							</CommandList>
						</CommandGroup>
					</CommandList>
				</Command>
			</DropdownMenuSubContent>

			<DropdownMenuSubTrigger>
				<Circle className={cn('stroke-none  mr-1.5', currentActivity?.available ? 'fill-green-500' : 'fill-red-500')} />
				<span>{currentActivity?.name}</span>
			</DropdownMenuSubTrigger>
		</DropdownMenuSub>
	);
};

export default ActivityDropdownMenuSub;
