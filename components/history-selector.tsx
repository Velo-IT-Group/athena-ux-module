'use client';
import { useEffect, useState } from 'react';
import { groupBy } from 'lodash';
import { createClient } from '@/utils/supabase/client';
import HistoryListItem from '@/app/(user)/history-list-item';
import { ScrollArea } from './ui/scroll-area';

type Props = {
	profile: Profile;
	initalConversations: Conversation[];
	align?: 'center' | 'end' | 'start';
	side?: 'top' | 'right' | 'bottom' | 'left';
};

const HistorySelector = ({ profile, initalConversations, align = 'end', side }: Props) => {
	const supabase = createClient();
	const [conversations, setConversations] = useState<Conversation[]>(initalConversations);

	useEffect(() => {
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

	const groupedCalls = groupBy(conversations, ({ date }) =>
		Intl.DateTimeFormat('en-US', { dateStyle: 'short' }).format(new Date(date))
	);

	return (
		<ScrollArea className='min-h-12 max-h-96 h-full flex flex-col bg-muted'>
			<div className='flex w-[285px] flex-col items-center justify-center gap-y-3 rounded-xl border py-3 px-1.5'>
				{Object?.entries(groupedCalls).map(([key, conversations], index) => (
					<div
						key={`${key}-separator`}
						className='w-full'
					>
						{/* {index !== 0 && <CommandSeparator key={`${key}-seperator`} />} */}
						<div
							key={key}
							className='w-full'
						>
							<span className='text-xs font-medium text-muted-foreground ml-1'>{key}</span>
							{conversations?.map((conversation) => (
								<HistoryListItem
									key={conversation.id}
									conversation={conversation as Conversation}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</ScrollArea>
	);
};

export default HistorySelector;
