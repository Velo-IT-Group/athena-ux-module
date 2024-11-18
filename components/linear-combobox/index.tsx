'use client';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useHotkeys } from '@/hooks/use-hot-keys';
import * as React from 'react';
import { CheckIcon } from './icons/check';
import { HighIcon } from './icons/high';
import { LowIcon } from './icons/low';
import { MediumIcon } from './icons/medium';
import { NoPriorityIcon } from './icons/no-priority';
import { UrgentIcon } from './icons/urgent';
import { Kbd } from './kbd';
import { Ellipsis, ListFilter } from 'lucide-react';
import { icons } from 'lucide-react';
import { cn } from '@/lib/utils';
import Icon from '@/components/Icon';

type FilterGroup = {
	label?: string;
	filters: FilterItem[];
};

export type FilterItem = {
	label: string;
	icon: string;
	value?: string;
	values?: FilterItem[];
};

type Priority = {
	value: (typeof priorities)[number]['value'];
	label: string;
	icon: any;
};

const priorities = [
	{ value: 'no-priority', label: 'No priority', icon: NoPriorityIcon },
	{ value: 'urgent', label: 'Urgent', icon: UrgentIcon },
	{ value: 'high', label: 'High', icon: HighIcon },
	{ value: 'medium', label: 'Medium', icon: MediumIcon },
	{ value: 'low', label: 'Low', icon: LowIcon },
] as const;

type Props = {
	filterGroups: FilterGroup[];
	filterValues: FilterItem[];
	setFilterValues: (value: React.SetStateAction<FilterItem[]>) => void;
	isValueSelector?: boolean;
	className?: string;
};

export const LinearCombobox = ({
	filterGroups,
	filterValues,
	setFilterValues,
	isValueSelector = false,
	className,
}: Props) => {
	const [openPopover, setOpenPopover] = React.useState(false);
	const [openTooltip, setOpenTooltip] = React.useState(false);

	const [searchValue, setSearchValue] = React.useState('');

	const isSearching = searchValue.length > 0;

	useHotkeys([
		[
			isValueSelector ? '' : 'f',
			() => {
				setOpenTooltip(false);
				setOpenPopover(true);
			},
		],
	]);

	return (
		<Popover
			open={openPopover}
			onOpenChange={setOpenPopover}>
			<Tooltip
				delayDuration={500}
				open={openTooltip}
				onOpenChange={setOpenTooltip}>
				<TooltipTrigger asChild>
					<PopoverTrigger asChild>
						<Button
							aria-label="Filter"
							variant="ghost"
							size={
								!isValueSelector && filterValues.length > 0
									? 'icon'
									: 'sm'
							}
							className={cn(
								'w-fit px-1.5 h-8 text-sm leading-normal font-medium text-primary',
								className
							)}>
							{isValueSelector ? (
								<>
									{filterValues.length === 0 ? (
										<Ellipsis />
									) : (
										<>
											{filterValues.length === 1 ? (
												filterValues.map((filter) => {
													return (
														<React.Fragment
															key={`filter-value-${filter.label}`}>
															<Icon
																name={
																	filter.icon
																}
																className="mr-1.5"
															/>
															<span className="text-xs">
																{filter.label}
															</span>
														</React.Fragment>
													);
												})
											) : (
												<span className="lowercase">
													{filterValues.length}{' '}
													{filterValues[0].label}s
												</span>
											)}
										</>
									)}
								</>
							) : (
								<>
									<ListFilter
										className={cn(
											filterValues.length === 0 &&
												'mr-1.5'
										)}
									/>
									<span
										className={cn(
											'text-xs',
											filterValues.length > 0 && 'sr-only'
										)}>
										Filter
									</span>
								</>
							)}
						</Button>
					</PopoverTrigger>
				</TooltipTrigger>

				<TooltipContent
					hideWhenDetached
					side="bottom"
					align="start"
					sideOffset={6}
					className="flex items-center gap-1.5 bg-background border text-xs px-1.5 h-8">
					<span className="text-primary">Change priority</span>

					<Kbd letter="p" />
				</TooltipContent>
			</Tooltip>

			<PopoverContent
				className="w-fit p-0 rounded-lg"
				align="start"
				onCloseAutoFocus={(e) => e.preventDefault()}
				sideOffset={6}>
				<Command className="rounded-lg">
					<CommandInput
						value={searchValue}
						onValueChange={(searchValue) => {
							// If the user types a number, select the priority like useHotkeys
							if (
								[0, 1, 2, 3, 4].includes(
									Number.parseInt(searchValue)
								)
							) {
								setOpenTooltip(false);
								setOpenPopover(false);
								setSearchValue('');
								return;
							}
							setSearchValue(searchValue);
						}}
						className="text-sm leading-normal"
						placeholder="Filter...">
						{!isSearching && <Kbd letter="f" />}
					</CommandInput>

					<CommandList>
						{filterGroups.map(({ label, filters }, index) => (
							<CommandGroup
								key={`filter-group-${index}`}
								heading={label}>
								{filters.map((filter) => (
									<CommandItem
										key={filter.label}
										value={filter.label}
										onSelect={(value) => {
											// setSelectedPriority(filter);
											setOpenTooltip(false);
											setOpenPopover(false);
											setSearchValue('');
											setFilterValues((prev) => [
												...prev,
												filter,
											]);
										}}
										className="group rounded-md flex justify-between gap-3 items-center w-full text-[0.8125rem] leading-normal text-primary">
										<div className="flex items-center">
											{filter.icon && (
												<Icon
													name={filter.icon}
													className="mr-1.5 size-3"
												/>
											)}

											<span>{filter.label}</span>
										</div>

										<div className="flex items-center">
											{filterValues.some(
												(f) => f.label === filter.label
											) && (
												<CheckIcon
													title="Check"
													className="mx-3 size-4 group-hover:fill-primary"
												/>
											)}

											{!isSearching && (
												<span className="text-xs">
													{index}
												</span>
											)}
										</div>
									</CommandItem>
								))}
							</CommandGroup>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};
