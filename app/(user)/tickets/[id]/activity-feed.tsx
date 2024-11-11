import React from 'react';
import { getAuditTrail, getTicketNotes } from '@/lib/manage/read';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from 'lucide-react';
import ActivityList from '@/components/lists/activity-list';
import NoteItem from '@/components/note-item';

export default async function ActivityFeed({ id }: { id: number }) {
	const [entries, notes] = await Promise.all([
		getAuditTrail('Ticket', id, {
			orderBy: {
				key: 'enteredDate',
				order: 'desc',
			},
		}),
		getTicketNotes(id),
	]);

	const discussionNotes = notes.filter((note) => note.detailDescriptionFlag && !note.internalAnalysisFlag);
	const internalNotes = notes.filter((note) => note.internalFlag && note.internalAnalysisFlag);
	const resolutionNotes = notes.filter((note) => note.resolutionFlag);

	return (
		<div className='space-y-3'>
			<Accordion type='multiple'>
				<AccordionItem value='activity'>
					<AccordionTrigger className='flex items-center justify-between'>
						<h4 className='font-medium text-sm'>Audit Trail</h4>
					</AccordionTrigger>

					<AccordionContent>
						<div className='text-muted-foreground grid gap-6'>
							<ActivityList
								activities={entries.map((entry) => {
									return { icon: User, date: new Date(entry.enteredDate), text: `${entry.enteredBy} ${entry.text}` };
								})}
							/>
						</div>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value='notes'>
					<AccordionTrigger className='flex items-center justify-between'>
						<h4 className='font-medium text-sm'>Notes</h4>
					</AccordionTrigger>

					<AccordionContent>
						<Tabs defaultValue='all'>
							<TabsList>
								<TabsTrigger value='all'>All ({notes.length})</TabsTrigger>
								<TabsTrigger value='discussion'>Discussion ({discussionNotes.length})</TabsTrigger>
								<TabsTrigger value='internal'>Internal ({internalNotes.length})</TabsTrigger>
								<TabsTrigger value='resolution'>Resolution ({resolutionNotes.length})</TabsTrigger>
							</TabsList>

							<TabsContent
								value='all'
								className='space-y-3'
							>
								{notes.map((note) => (
									<NoteItem
										key={note.id}
										note={note}
									/>
								))}
							</TabsContent>

							<TabsContent
								value='discussion'
								className='space-y-3'
							>
								{discussionNotes.map((note) => (
									<NoteItem
										key={note.id}
										note={note}
									/>
								))}
							</TabsContent>

							<TabsContent
								value='internal'
								className='space-y-3'
							>
								{internalNotes.map((note) => (
									<NoteItem
										key={note.id}
										note={note}
									/>
								))}
							</TabsContent>

							<TabsContent
								value='resolution'
								className='space-y-3'
							>
								{resolutionNotes.map((note) => (
									<NoteItem
										key={note.id}
										note={note}
									/>
								))}
							</TabsContent>
						</Tabs>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			{/* <form
				action={async (data: FormData) => {
					'use server';
					try {
						const noteType = data.get('noteType');
						console.log(noteType);
						await createTicketNote(id, {
							text: data.get('text') as string,
							internalFlag: noteType === 'internalFlag',
							internalAnalysisFlag: noteType === 'internalFlag',
							detailDescriptionFlag: noteType === 'detailDescriptionFlag',
						});
					} catch (error) {
						console.error(error);
					}
				}}
			>
				<Card>
					<CardContent className='p-3'>
						<Textarea
							placeholder='Add a comment...'
							className='border-none shadow-none resize-none'
							minRows={2}
							name='text'
						/>
					</CardContent>

					<CardFooter className='justify-end space-x-1.5 p-3 pt-0'>
						<Select
							name='noteType'
							defaultValue='detailDescriptionFlag'
						>
							<SelectTrigger className='w-1/5'>
								<SelectValue placeholder='Select a note type...' />
							</SelectTrigger>

							<SelectContent side='top'>
								<SelectItem value='detailDescriptionFlag'>Discussion</SelectItem>
								<SelectItem value='internalFlag'>Internal</SelectItem>
								<SelectItem value='resolutionFlag'>Resolution</SelectItem>
							</SelectContent>
						</Select>

						<Button
							variant='ghost'
							size='icon'
						>
							<Paperclip />
						</Button>

						<Button
							variant='outline'
							size='icon'
						>
							<ArrowUp />
						</Button>
					</CardFooter>
				</Card>
			</form> */}
		</div>
	);
}
