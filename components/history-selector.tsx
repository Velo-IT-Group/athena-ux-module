'use client';
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
import { createClient } from '@/utils/supabase/client';
import HistoryListItem from '@/app/(user)/history-list-item';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { SidebarMenuButton } from './ui/sidebar';

type Props = {
	profile: Profile;
	initalConversations: Conversation[];
	align?: 'center' | 'end' | 'start';
	side?: 'top' | 'right' | 'bottom' | 'left';
	isCollapsed: boolean;
};

const HistorySelector = ({ profile, initalConversations, align = 'end', side, isCollapsed }: Props) => {
	const supabase = createClient();
	const [conversations, setConversations] = useState<Conversation[]>(initalConversations);

	useEffect(() => {
		// setConversations(initalConversations);
		const channel = supabase
			.channel('reporting_conversations')
			.on(
				'postgres_changes',
				{ event: 'INSERT', schema: 'reporting', table: 'conversations', filter: `agent=eq.${profile?.worker_sid}` },
				(payload) => {
					const newItem = payload.new as Conversation;
					setConversations((prev) => [...prev.filter((c) => c.id !== newItem.id), newItem]);
				}
			)
			.on(
				'postgres_changes',
				{ event: 'UPDATE', schema: 'reporting', table: 'conversations', filter: `agent=eq.${profile?.worker_sid}` },
				(payload) => {
					const newItem = payload.new as Conversation;
					setConversations((prev) => [...prev.filter((c) => c.id !== newItem.id), newItem]);
				}
			)
			.subscribe();

		return () => {
			channel.unsubscribe();
		};
	}, []);

	// .schema('reporting')
	// .from('conversations')
	// .select('id, date, direction, phone_number, talk_time, contact_id')
	// .eq('agent', user?.user_metadata.workerSid ?? '')
	// .order('date', { ascending: false });

	const groupedCalls = groupBy(conversations, ({ date }) =>
		Intl.DateTimeFormat('en-US', { dateStyle: 'short' }).format(new Date(date))
	);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<SidebarMenuButton
					role='combobox'
					size='sm'
				>
					<History />
					<span>History</span>
				</SidebarMenuButton>
			</PopoverTrigger>

			<PopoverContent
				align={align}
				side={side}
				sideOffset={12}
				className='min-w-80 p-0'
			>
				<Command>
					<CommandInput placeholder='Filter calls...' />

					<CommandEmpty>No call history found.</CommandEmpty>

					<CommandList className='relative'>
						{Object?.entries(groupedCalls).map(([key, conversations], index) => (
							<div key={`${key}-separator`}>
								{index !== 0 && <CommandSeparator key={`${key}-seperator`} />}
								<CommandGroup
									key={key}
									heading={key}
									className='[&_[cmdk-group-heading]]:sticky [&_[cmdk-group-heading]]:top-0 relative'
								>
									{conversations?.map((conversation) => (
										<HistoryListItem
											key={conversation.id}
											conversation={conversation as Conversation}
										/>
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
