import React from 'react';
import Properties from './properties';
import { Input } from '@/components/ui/input';
import { getTicket, getTicketNotes } from '@/lib/manage/read';
import Tiptap from '@/components/tip-tap';
import { Separator } from '@/components/ui/separator';
import ActivityFeed from './activity-feed';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

type Props = {
	params: { id: string };
};

export default async function Page({ params }: Props) {
	const [ticket, notes] = await Promise.all([getTicket(Number(params.id)), getTicketNotes(Number(params.id))]);

	const initalNote = notes.find((note) => note.detailDescriptionFlag);

	return (
		<main className='grid grid-cols-[1fr_280px] items-start gap-3 h-full bg-muted/15'>
			<ScrollArea className='grid min-h-0'>
				<div className='max-w-3xl w-full mx-auto py-10 grid items-start'>
					<form action=''>
						<Textarea
							name='summary'
							defaultValue={ticket.summary}
							className='border-none text-2xl font-semibold focus-visible:ring-0 shadow-none resize-none'
						/>

						<Textarea
							placeholder='Add a comment...'
							className='border-none shadow-none resize-none'
							defaultValue={initalNote?.text}
							minRows={2}
						/>
					</form>

					<Separator />

					<ActivityFeed id={Number(params.id)} />
				</div>
			</ScrollArea>

			<div className='border-l h-full'>
				<Properties ticket={ticket} />
			</div>
		</main>
	);
}
