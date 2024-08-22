import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { relativeDate } from '@/utils/date';
import { Ellipsis, Reply, SmilePlus } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { TicketNote } from '@/types/manage';

type Props = {
	note: TicketNote;
};

const NoteItem = ({ note }: Props) => {
	return (
		<Card>
			<CardHeader className='flex flex-row items-center gap-1.5 p-3 space-y-0 group'>
				<CardTitle className='text-sm flex items-center gap-1.5'>
					<Avatar className='h-5 w-5'>
						<AvatarFallback className='text-[9px] uppercase'>
							{note?.createdBy && note?.createdBy[0]}
							{note?.createdBy && note?.createdBy[1]}
						</AvatarFallback>
					</Avatar>

					<span>{note.createdBy}</span>
				</CardTitle>

				<CardDescription className='text-xs'>
					{relativeDate(note?.dateCreated ? new Date(note?.dateCreated) : new Date())}
				</CardDescription>

				<div className='opacity-0 transition-opacity group-hover:opacity-100 flex items-center gap-1.5 ml-auto'>
					<Button
						variant='ghost'
						size='sm'
					>
						<SmilePlus />
					</Button>

					<Button
						variant='ghost'
						size='sm'
					>
						<Reply />
					</Button>

					<Button
						variant='ghost'
						size='sm'
					>
						<Ellipsis />
					</Button>
				</div>
			</CardHeader>

			<CardContent className='p-3 pt-0'>
				<Textarea
					readOnly
					// disabled
					className='border-none shadow-none resize-none pointer-events-none'
					value={note.text}
				/>
			</CardContent>
		</Card>
	);
};

export default NoteItem;
