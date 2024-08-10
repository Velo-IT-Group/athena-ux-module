import React from 'react';
import ActivityItem from './activity-item';
import { getAuditTrail, getTicketNotes } from '@/lib/manage/read';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp, Ellipsis, Paperclip, Reply, SmilePlus, User } from 'lucide-react';
import { createTicketNote } from '@/lib/manage/create';
import { toast } from 'sonner';
import ActivityList from '@/components/activity-list';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { relativeDate } from '@/utils/date';

export default async function ActivityFeed({ id }: { id: number }) {
	const [entries, notes] = await Promise.all([
		getAuditTrail('Ticket', id, { orderBy: { key: 'enteredDate', order: 'desc' } }),
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
											<p>{note.text}</p>
										</CardContent>
									</Card>
								))}
							</TabsContent>

							<TabsContent
								value='discussion'
								className='space-y-3'
							>
								{discussionNotes.map((note) => (
									<Card>
										<CardContent className='p-3'>
											<p className='text-wrap line-clamp-5'>{note.text}</p>
										</CardContent>
									</Card>
								))}
							</TabsContent>

							<TabsContent
								value='internal'
								className='space-y-3'
							>
								{internalNotes.map((note) => (
									<Card>
										<CardContent className='p-3'>
											<p>{note.text}</p>
										</CardContent>
									</Card>
								))}
							</TabsContent>

							<TabsContent
								value='resolution'
								className='space-y-3'
							>
								{resolutionNotes.map((note) => (
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
			</form>
		</div>
	);
}
