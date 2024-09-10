'use client';
import { ReactNode, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { WorkerInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/worker';
import { useQuery } from '@tanstack/react-query';
import { useTwilio } from '@/providers/twilio-provider';
import { Task, Worker, Workspace } from 'twilio-taskrouter';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { getSystemMembers } from '@/lib/manage/read';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { isLastDayOfMonth } from 'date-fns';

type Props = {
	task?: Task;
	children?: ReactNode;
};

const WorkerSelector = ({ task, children }: Props) => {
	const { token, currentWorkspace } = useTwilio();
	const workspace = new Workspace(token, {}, currentWorkspace);
	const { data } = useQuery({
		queryKey: ['workers'],
		queryFn: () => workspace.fetchWorkers(),
	});
	const {
		data: members,
		isLoading: isMembersLoading,
		error,
	} = useQuery({
		queryKey: ['members'],
		queryFn: () =>
			getSystemMembers({
				conditions: [
					{ parameter: { inactiveFlag: false } },
					{ parameter: { officePhone: `'${null}'` }, comparator: '!=' },
				],
				fields: ['id', 'firstName', 'lastName', 'officeEmail'],
				orderBy: { key: 'firstName' },
				pageSize: 1000,
			}),
	});
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState<WorkerInstance>();
	const workers = Array.from(data?.values() ?? []);
	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild={children !== undefined}>
				{children === undefined ? (
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={open}
						className='justify-between'
					>
						{value ? workers?.find((item) => item.sid === value.sid)?.friendlyName : 'Search'}
						<ChevronsUpDown className='ml-2 h-3.5 w-3.5 shrink-0 opacity-50' />
					</Button>
				) : (
					children
				)}
			</PopoverTrigger>

			<PopoverContent
				align='start'
				className='min-w-52 p-0'
				side='bottom'
				avoidCollisions
			>
				<Command>
					<CommandInput placeholder={'Filter workers'} />
					<CommandEmpty>Nothing found.</CommandEmpty>
					{isMembersLoading ? (
						<CommandList>
							{new Array(12).fill(null)?.map((_, index) => (
								<CommandItem
									key={index}
									value={String(index)}
								>
									<Skeleton className='h-5 w-full' />
								</CommandItem>
							))}
						</CommandList>
					) : (
						<CommandList>
							<CommandItem
								value='WK8581b96b9e41195dfbaa64498ba1a088'
								className='flex items-center justify-between gap-3'
								onSelect={async (value) => {
									await task?.transfer(value, {});
								}}
							>
								<span>Nicholas Black</span>

								<div className='flex items-center gap-3'>
									<Button
										size='smIcon'
										variant='ghost'
									>
										<Image
											src='/velo-favicon.svg'
											alt='Athena'
											className='object-contain h-4 w-4'
											width={16}
											height={16}
										/>
									</Button>
								</div>
							</CommandItem>

							<CommandSeparator />

							{members?.map((item) => (
								<CommandItem
									key={item.id}
									value={`${item.id}-${item.firstName} ${item.lastName ?? ''}`}
									onSelect={(currentValue) => {
										console.log(currentValue);
										const id = currentValue.split('-')[0];
										console.log(id);
										setOpen(false);
									}}
									className='flex items-center justify-between gap-3'
								>
									<span>
										{item.firstName} {item.lastName ?? ''}
									</span>

									<div className='flex items-center gap-3'>
										{workers.some((worker) => worker.attributes.email === item.officeEmail) && (
											<Button
												size='smIcon'
												variant='ghost'
											>
												<Image
													src='/velo-favicon.svg'
													alt='Athena'
													className='object-contain h-4 w-4'
													width={16}
													height={16}
												/>
											</Button>
										)}

										<Button
											size='smIcon'
											variant='ghost'
										>
											<Image
												src='/teamsLogo.svg'
												alt='Microsoft Teams Logo'
												className='object-contain h-4 w-4'
												width={16}
												height={16}
											/>
										</Button>
									</div>
								</CommandItem>
							))}
						</CommandList>
					)}
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default WorkerSelector;
