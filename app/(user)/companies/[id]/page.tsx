import { getBoards, getCompany, getCompanyNotes, getCompanySites, getConfigurations } from '@/lib/manage/read';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Globe, MapPin, NotebookPen, Phone, PlusCircle, Tag, User } from 'lucide-react';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import parsePhoneNumber from 'libphonenumber-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { groupBy } from 'lodash';
import Tiptap from '@/components/tip-tap';
import AsyncSelector from '@/components/async-selector';
import ConfigurationsList from '@/components/lists/configurations-list';
import TableSkeleton from '@/components/ui/data-table/skeleton';

type Props = {
	params: { id: number };
};

const Page = async ({ params }: Props) => {
	const [company, notes, sites, applications, servers] = await Promise.all([
		getCompany(Number(params.id)),
		getCompanyNotes(Number(params.id), { conditions: [{ parameter: { 'type/id': 3 }, comparator: '!=' }] }),
		getCompanySites(Number(params.id)),
		getConfigurations({
			fields: ['id', 'name', 'type', 'notes'],
			conditions: [
				{ parameter: { 'company/id': Number(params.id) } },
				{ parameter: { 'status/id': 2 } },
				{ parameter: { 'type/id': 191 } },
			],
			childConditions: [{ parameter: { 'questions/questionId': '1597' } }],
			orderBy: { key: 'name' },
		}),
		getConfigurations({
			fields: ['id', 'name', 'type', 'notes'],
			conditions: [
				{ parameter: { 'company/id': Number(params.id) } },
				{ parameter: { 'status/id': 2 } },
				{ parameter: { 'type/id': 'in (211, 212, 219)' } },
			],
			orderBy: { key: 'name' },
		}),
	]);

	return (
		<main className='h-full bg-muted/15'>
			<ResizablePanelGroup
				direction='horizontal'
				className='flex flex-col min-h-0'
			>
				<ResizablePanel className='min-h-0 flex flex-col'>
					<ScrollArea className='flex flex-col min-h-0 max-w-3xl w-full mx-auto py-10 px-3'>
						<Textarea
							name='summary'
							defaultValue={company.name}
							className='border-none text-2xl font-semibold focus-visible:ring-0 shadow-none resize-none'
						/>

						<Textarea
							placeholder='Add a description...'
							className='border-none shadow-none resize-none'
							defaultValue='Acadiana Bottling distributes Pepsi and Dr. Pepper products throughout the Acadiana region. They have about 70 full time office and sales workers depending on a laptop or desktop to complete tasks on a daily basis, and about 20 delivery drivers in the field depending on handheld devices, iPhones, and mobile printers to do their work throughout the day.'
							minRows={2}
						/>

						<h2>SOP Exceptions</h2>

						{/* <Tiptap /> */}

						<Separator />

						<Accordion type='multiple'>
							<AccordionItem value='sites'>
								<AccordionTrigger className='flex items-center justify-between'>
									<h4 className='font-medium text-sm'>Sites</h4>
								</AccordionTrigger>

								<AccordionContent>
									<div className='space-y-3'>
										{sites.map((site) => (
											<div
												key={site.id}
												className='flex items-center gap-3'
											>
												<MapPin />
												<span>{site.name}</span>
											</div>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value='notes'>
								<AccordionTrigger className='gap-3'>
									<h4 className='font-medium text-sm'>Notes</h4>
									<Button
										variant='ghost'
										size='sm'
										className='shrink-0 ml-auto h-5 w-5 p-0'
									>
										<PlusCircle />
									</Button>
								</AccordionTrigger>

								<AccordionContent className='p-1'>
									<div className='space-y-3'>
										{notes.map((note) => (
											<div
												key={note.id}
												className='flex gap-3'
											>
												<div className='py-3'>
													<NotebookPen className='shrink-0' />
												</div>

												<Textarea
													className='w-full resize-none border-none shadow-none'
													defaultValue={note.text}
												/>
											</div>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value='configurations'>
								<AccordionTrigger className='gap-3'>
									<h4 className='font-medium text-sm'>Configurations</h4>
								</AccordionTrigger>

								<AccordionContent className='p-1'>
									<Tabs defaultValue='servers'>
										<TabsList>
											<TabsTrigger value='quickView'>Quick View</TabsTrigger>
											<TabsTrigger value='servers'>Servers</TabsTrigger>
											<TabsTrigger value='applications'>Applications</TabsTrigger>
										</TabsList>

										<TabsContent value='quickView'>
											<Suspense fallback={<TableSkeleton />}>
												<ConfigurationsList
													type='table'
													params={{
														fields: ['id', 'name', 'type', 'notes', 'contact', 'status', 'site'],
														conditions: [
															{ parameter: { 'company/id': Number(params.id) } },
															{ parameter: { 'status/id': 2 } },
															{ parameter: { 'type/id': 191 } },
														],
														childConditions: [{ parameter: { 'questions/questionId': '1597' } }],
														orderBy: { key: 'name' },
													}}
												/>
											</Suspense>
										</TabsContent>

										<TabsContent value='servers'>
											<Suspense fallback={<TableSkeleton />}>
												<ConfigurationsList
													type='table'
													params={{
														fields: ['id', 'name', 'contact', 'status', 'site'],
														conditions: [
															{ parameter: { 'company/id': Number(params.id) } },
															{ parameter: { 'status/id': 2 } },
															{ parameter: { 'type/id': 191 } },
														],
														childConditions: [{ parameter: { 'questions/questionId': '1597' } }],
														orderBy: { key: 'name' },
													}}
												/>
											</Suspense>
										</TabsContent>

										<TabsContent value='applications'>
											<Suspense fallback={<TableSkeleton />}>
												<ConfigurationsList
													type='table'
													params={{
														fields: ['id', 'name', 'type', 'notes', 'contact', 'status', 'site'],
														conditions: [
															{ parameter: { 'company/id': Number(params.id) } },
															{ parameter: { 'status/id': 2 } },
															{ parameter: { 'type/id': 'in (211, 212, 219)' } },
														],
														orderBy: { key: 'name' },
													}}
												/>
											</Suspense>
										</TabsContent>
									</Tabs>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</ScrollArea>
				</ResizablePanel>

				<ResizableHandle />

				<ResizablePanel
					minSize={24}
					defaultSize={27}
					maxSize={45}
				>
					<div className='h-full'>
						<div className='py-6 space-y-6'>
							<section className='grid px-3'>
								<div className='grid grid-cols-4 items-center h-9'>
									<Label className='text-nowrap text-xs font-normal'>Stoplight</Label>

									<div className='col-span-3'>
										<Badge
											className='mx-1.5'
											variant={'caution'}
										>
											Yellow
										</Badge>
									</div>
								</div>

								<div className='grid grid-cols-4 items-center h-9'>
									<Label className='text-nowrap text-xs font-normal'>Site</Label>

									<div className='col-span-3'>
										<Button
											variant='ghost'
											size='sm'
											className='flex'
										>
											<MapPin className='mr-1.5' />
											<span className='text-xs text-muted-foreground'>{company.site?.name}</span>
										</Button>
									</div>
								</div>

								<div className='grid grid-cols-4 items-center h-9'>
									<Label className='text-nowrap text-xs font-normal'>Phone</Label>

									<div className='col-span-3'>
										<Button
											variant='ghost'
											size='sm'
											className='flex'
										>
											<Phone className='mr-1.5' />
											<span className='text-xs text-muted-foreground'>
												{parsePhoneNumber(company.phoneNumber, 'US')?.formatNational()}
											</span>
										</Button>
									</div>
								</div>

								<div className='grid grid-cols-4 items-center h-9'>
									<Label className='text-nowrap text-xs font-normal'>Contact</Label>
									<div className='col-span-3'>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant='ghost'
													size='sm'
													className='flex'
												>
													<User className='mr-1.5' />
													<span className='text-xs text-muted-foreground'>{company.defaultContact?.name}</span>
												</Button>
											</PopoverTrigger>

											<PopoverContent></PopoverContent>
										</Popover>
										{/* <Suspense>
											<ContactSelector
												contact={company.defaultContact}
												company={company}
											/>
										</Suspense> */}
									</div>
								</div>

								<div className='grid grid-cols-4 items-center h-9'>
									<Label className='text-nowrap text-xs font-normal'>Territory</Label>

									<div className='col-span-3'>
										<Button
											variant='ghost'
											size='sm'
											className='flex'
										>
											<Globe className='mr-1.5' />
											<span className='text-xs text-muted-foreground'>Team B</span>
										</Button>
									</div>
								</div>
							</section>

							<Separator />

							<section>
								<h4 className='text-xs text-muted-foreground font-medium px-3'>Attachments</h4>

								{/* {attachments
									?.filter((attachment) => attachment.documentType.id === 7)
									.map((attachment) => (
										<Tooltip>
											<TooltipTrigger>
												<div
													key={attachment.id}
													className='flex items-center gap-3'
												>
													<Paperclip />

													<span className='line-clamp-1'>{attachment.title}</span>
												</div>
											</TooltipTrigger>

											<TooltipContent>
												<audio controls>
													<source
														src={attachment.fileName}
														type='audio/ogg'
													/>
													<source
														src={attachment.fileName}
														type='audio/mpeg'
													/>
													Your browser does not support the audio element.
												</audio>
											</TooltipContent>
										</Tooltip>
									))} */}
							</section>
						</div>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</main>
	);
};

export default Page;
