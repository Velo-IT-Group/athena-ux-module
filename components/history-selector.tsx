import { History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { groupBy } from 'lodash';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import HistoryListItem from '@/app/(user)/history-list-item';

type Props = {
	user: User | null;
};

const HistorySelector = async ({ user }: Props) => {
	const supabase = createClient();
	const { data: conversation } = await supabase
		.schema('reporting')
		.from('conversations')
		.select('id, date, direction, phone_number, talk_time, contact_id')
		.eq('agent', user?.user_metadata.workerSid ?? '')
		.order('date', { ascending: false });

	const groupedCalls = groupBy(conversation, ({ date }) =>
		Intl.DateTimeFormat('en-US', { dateStyle: 'short' }).format(new Date(date))
	);

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

			<PopoverContent
				className='min-w-80 p-0'
				align='end'
			>
				<Command>
					<CommandInput placeholder='Filter calls...' />

					<CommandEmpty>No call history found.</CommandEmpty>

					<CommandList>
						{Object?.entries(groupedCalls).map(([key, conversations], index) => (
							<div key={`${key}-separator`}>
								{index !== 0 && <CommandSeparator key={`${key}-seperator`} />}
								<CommandGroup
									key={key}
									heading={key}
								>
									{conversations?.map((conversation) => (
										<HistoryListItem conversation={conversation as Conversation} />
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
