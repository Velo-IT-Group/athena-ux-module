import { History, PhoneIncoming, PhoneOutgoing } from 'lucide-react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { groupBy } from 'lodash';
import { getAllCalls } from '@/lib/twilio/read';
import getQueryClient from '@/app/getQueryClient';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import { parsePhoneNumber } from '@/lib/utils';

type Props = {
	user: User | null;
};

const HistorySelector = async ({ user }: Props) => {
	const supabase = createClient();
	const { data: calls, error } = await supabase
		.schema('reporting')
		.from('conversations')
		.select()
		.eq('agent', user?.email ?? '')
		.order('date', { ascending: false });
	console.log(calls);
	const queryClient = getQueryClient();

	// console.log(user?.email);
	// Note we are now using fetchQuery()
	// const calls = await queryClient.fetchQuery({
	// 	queryKey: ['allCalls'],
	// 	queryFn: () => getAllCalls(`client:${user?.email ?? ''}`),
	// });

	const groupedCalls = groupBy(calls, ({ date }) =>
		Intl.DateTimeFormat('en-US', { dateStyle: 'short' }).format(new Date(date))
	);

	// console.log(groupedCalls);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant='ghost'
					role='combobox'
					className='justify-between'
				>
					<History />
				</Button>
			</PopoverTrigger>

			<PopoverContent className='min-w-72 p-0'>
				<Command>
					<CommandInput placeholder='Filter calls...' />

					<CommandEmpty>No call history found.</CommandEmpty>

					<CommandList>
						{Object?.entries(groupedCalls).map(([key, calls], index) => (
							<div key={`${key}-separator`}>
								{index !== 0 && <CommandSeparator key={`${key}-seperator`} />}
								<CommandGroup
									key={key}
									heading={key}
								>
									{calls?.map((call) => (
										<CommandItem
											key={call.id}
											value={call.id}
											// onSelect={(currentValue) => {
											// 	// const call =
											// 	// setValue(value && currentValue === value ? '' : currentValue);
											// 	// setOpen(false);
											// }}
										>
											{call.direction === 'outbound' ? (
												<PhoneOutgoing className='mr-1.5 text-red-500' />
											) : (
												<PhoneIncoming className='mr-1.5 text-green-500' />
											)}
											<span className='text-muted-foreground'>
												{parsePhoneNumber(call.phone_number ?? '').formattedNumber}{' '}
												{Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(new Date(call.date))}
											</span>
										</CommandItem>
									))}
								</CommandGroup>
							</div>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default HistorySelector;
