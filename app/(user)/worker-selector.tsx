'use client';
import { ReactNode, useState } from 'react';
import { Building, ChevronsUpDown, Phone, PhoneForwarded, Smartphone } from 'lucide-react';
import { WorkerInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/worker';
import { useQuery } from '@tanstack/react-query';
import { useTwilio } from '@/providers/twilio-provider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command';
import { getSystemMembers } from '@/lib/manage/read';
import { Skeleton } from '@/components/ui/skeleton';
import { useWorker } from '@/providers/worker-provider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import WorkerListItem from './worker-list-item';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { parsePhoneNumber } from '@/lib/utils';
import { SystemMember } from '@/types/manage';

type Props = {
	actionFn?: (isWorker: boolean, id: string | number) => void;
	children?: ReactNode;
};

const WorkerSelector = ({ actionFn, children }: Props) => {
	const { workspace } = useTwilio();
	const { worker: currentWorker } = useWorker();
	const { data, isLoading: isWorkersLoading } = useQuery({
		queryKey: ['workers'],
		queryFn: () => workspace?.fetchWorkers({ ActivityName: 'Available' }),
		refetchInterval: 1000,
	});
	const { data: members, isLoading: isMembersLoading } = useQuery({
		queryKey: ['members'],
		queryFn: () =>
			getSystemMembers({
				conditions: {
					inactiveFlag: false,
					// officePhone: `not '${null}'`
				},
				fields: ['id', 'firstName', 'lastName', 'homePhone', 'mobilePhone', 'officePhone', 'defaultPhone'],
				orderBy: { key: 'firstName' },
				pageSize: 1000,
			}),
	});
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState<WorkerInstance>();
	const workers = Array.from(data?.values() ?? []);

	function hasMultipleNumbers(member: SystemMember) {
		const phoneKeys = ['homePhone', 'mobilePhone', 'officePhone'];

		let valueCount = 0;

		for (const key of phoneKeys) {
			// @ts-ignore
			if (member[key]) {
				valueCount++;
			}

			if (valueCount > 1) {
				return true;
			}
		}

		return false;
	}

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
					<CommandInput placeholder='Filter directory...' />
					<CommandEmpty>Nothing found.</CommandEmpty>
					<CommandList>
						<CommandGroup heading='Workers'>
							{isWorkersLoading ? (
								<>
									{new Array(12).fill(null)?.map((_, index) => (
										<CommandItem
											key={index}
											value={String(index)}
										>
											<Skeleton className='h-5 w-full' />
										</CommandItem>
									))}
								</>
							) : (
								<>
									{workers?.map((worker) => {
										return (
											<CommandItem
												key={worker.sid}
												value={`${worker.sid}-${worker.attributes.full_name}`}
												onSelect={(currentValue) => {
													const id = currentValue.split('-')[0];
													actionFn && actionFn(true, id);
													setOpen(false);
												}}
												className='flex items-center justify-between gap-3'
												disabled={worker.sid === currentWorker?.sid}
											>
												<Tooltip>
													<span>{worker.attributes.full_name ?? worker.sid}</span>

													<TooltipTrigger asChild>
														<Button
															size='smIcon'
															variant='ghost'
														>
															<PhoneForwarded />
														</Button>
													</TooltipTrigger>

													<TooltipContent
														side='top'
														align='center'
													>
														Transfer
													</TooltipContent>
												</Tooltip>
											</CommandItem>
										);
									})}
								</>
							)}
						</CommandGroup>

						<CommandSeparator />

						<CommandGroup heading='External'>
							{isMembersLoading ? (
								<>
									{new Array(12).fill(null)?.map((_, index) => (
										<CommandItem
											key={index}
											value={String(index)}
										>
											<Skeleton className='h-5 w-full' />
										</CommandItem>
									))}
								</>
							) : (
								<>
									{members?.map((member) => {
										return (
											<CommandItem
												value={`${member.officePhone ?? member.mobilePhone ?? member.officePhone}-${member.firstName} ${
													member.lastName ?? ''
												}`}
												onSelect={(currentValue) => {
													if (!hasMultipleNumbers(member)) {
														const id = currentValue.split('-')[0];
														actionFn?.(false, id);
														setOpen(false);
														// onOpenChange(false);
														return;
													}

													setOpen(true);
												}}
												className='flex items-center justify-between gap-3'
											>
												<span>
													{member.firstName} {member.lastName ?? ''}
												</span>

												{hasMultipleNumbers(member) ? (
													<DropdownMenu
														open={open}
														onOpenChange={setOpen}
													>
														<DropdownMenuTrigger asChild>
															<Button
																size='smIcon'
																variant='ghost'
															>
																<PhoneForwarded />
															</Button>
														</DropdownMenuTrigger>

														<DropdownMenuContent
															side='right'
															align='start'
														>
															{member.homePhone && (
																<DropdownMenuItem
																	defaultChecked={member.defaultPhone === 'Home'}
																	onSelect={() => {
																		actionFn?.(false, member.homePhone!);
																		// onOpenChange(false);
																		setOpen(false);
																		return;
																	}}
																>
																	<Phone className='mr-1.5' /> {parsePhoneNumber(member.homePhone).formattedNumber}
																</DropdownMenuItem>
															)}

															{member.mobilePhone && (
																<DropdownMenuItem
																	defaultChecked={member.defaultPhone === 'Mobile'}
																	onSelect={() => {
																		actionFn?.(false, member.mobilePhone!);
																		// onOpenChange(false);
																		setOpen(false);
																		return;
																	}}
																>
																	<Smartphone className='mr-1.5' />{' '}
																	{parsePhoneNumber(member.mobilePhone).formattedNumber}
																</DropdownMenuItem>
															)}

															{member.officePhone && (
																<DropdownMenuItem
																	defaultChecked={member.defaultPhone === 'Office'}
																	onSelect={() => {
																		actionFn?.(false, member.officePhone!);
																		// onOpenChange(false);
																		setOpen(false);
																		return;
																	}}
																>
																	<Building className='mr-1.5' /> {parsePhoneNumber(member.officePhone).formattedNumber}
																</DropdownMenuItem>
															)}
														</DropdownMenuContent>
													</DropdownMenu>
												) : (
													<Button
														size='smIcon'
														variant='ghost'
													>
														<PhoneForwarded />
													</Button>
												)}
											</CommandItem>
											// <CommandItem
											// 	key={item.id}
											// 	value={`${item.officePhone}-${item.firstName} ${item.lastName ?? ''}`}
											// 	onSelect={(currentValue) => {
											// 		const id = currentValue.split('-')[0];
											// 		actionFn?.(false, id);
											// 		setOpen(false);
											// 	}}
											// 	className='flex items-center justify-between gap-3'
											// >
											// 	<span>
											// 		{item.firstName} {item.lastName ?? ''}
											// 	</span>

											// 	<Button
											// 		size='smIcon'
											// 		variant='ghost'
											// 	>
											// 		<PhoneForwarded />
											// 	</Button>
											// </CommandItem>
										);
									})}
								</>
							)}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default WorkerSelector;
