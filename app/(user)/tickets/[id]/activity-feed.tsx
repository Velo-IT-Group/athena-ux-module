import React from 'react';
import ActivityItem from './activity-item';
import { getAuditTrail, getTicketNotes } from '@/lib/manage/read';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp, Paperclip } from 'lucide-react';
import { createTicketNote } from '@/lib/manage/create';
import { toast } from 'sonner';

export default async function ActivityFeed({ id }: { id: number }) {
	const [entries, notes] = await Promise.all([
		getAuditTrail('Ticket', id, { orderBy: { key: 'enteredDate', order: 'desc' } }),
		getTicketNotes(id),
	]);

	return (
		<div className='space-y-3'>
			<Accordion type='multiple'>
				<AccordionItem value='activity'>
					<AccordionTrigger className='flex items-center justify-between'>
						<h4 className='font-medium text-sm'>Audit Trail</h4>
					</AccordionTrigger>

					<AccordionContent>
						<div className='text-muted-foreground grid gap-6'>
							<div className='relative'>
								<Separator
									orientation='vertical'
									className='absolute top-0 bottom-4 left-[18px] -z-10'
								/>

								<div className='space-y-3'>
									{entries.map((entry) => (
										<ActivityItem
											key={entry.text}
											entry={entry}
										/>
									))}
								</div>
							</div>
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
								<TabsTrigger value='all'>All (1)</TabsTrigger>
								<TabsTrigger value='discussion'>Discussion (1)</TabsTrigger>
								<TabsTrigger value='internal'>Internal</TabsTrigger>
								<TabsTrigger value='resolution'>Resolution</TabsTrigger>
							</TabsList>

							<TabsContent
								value='all'
								className='space-y-3'
							>
								{notes.map((note) => (
									<Card>
										<CardContent className='p-3'>
											<p>{note.text}</p>
										</CardContent>
									</Card>
								))}
							</TabsContent>
						</Tabs>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			<form
				action={async (data: FormData) => {
					'use server';
					try {
						const noteType = data.get('noteType');
						await createTicketNote(id, {
							text: data.get('text') as string,
							internalFlag: noteType === 'internalFlag',
							detailDescriptionFlag: noteType === 'detailDescriptionFlag',
						});
					} catch (error) {
						console.error(error);
					}
				}}
			>
				<Card>
					<CardHeader className='p-3'>
						<Select
							name='noteType'
							defaultValue='detailDescriptionFlag'
						>
							<SelectTrigger className='w-1/5'>
								<SelectValue placeholder='Select a note type...' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='detailDescriptionFlag'>Discussion</SelectItem>
								<SelectItem value='internalFlag'>Internal</SelectItem>
								<SelectItem value='resolutionFlag'>Resolution</SelectItem>
							</SelectContent>
						</Select>
					</CardHeader>

					<CardContent className='p-3 pt-0'>
						<Textarea
							placeholder='Add a comment...'
							className='border-none shadow-none resize-none'
							minRows={2}
							name='text'
						/>
					</CardContent>

					<CardFooter className='justify-end p-3 pt-0'>
						<Button
							variant='ghost'
							size='icon'
							className='rounded-full'
						>
							<Paperclip />
						</Button>

						<Button
							variant='ghost'
							size='icon'
							className='border rounded-full'
						>
							<ArrowUp />
						</Button>
					</CardFooter>
				</Card>

				<div className='flex justify-end gap-3 text-muted-foreground'></div>
			</form>
		</div>
	);
}
