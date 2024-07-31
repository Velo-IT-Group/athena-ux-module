import { getCompany, getCompanyNotes, getCompanySites, getConfigurations } from '@/lib/manage/read';
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

type Props = {
	params: { id: number };
};

const Page = async ({ params }: Props) => {
	const [company, notes, sites, applications, servers] = await Promise.all([
		getCompany(Number(params.id)),
		getCompanyNotes(Number(params.id)),
		getCompanySites(Number(params.id)),
		getConfigurations({
			fields: ['id', 'name', 'type', 'notes'],
			conditions: [{ 'company/id': Number(params.id) }, { 'status/id': 2 }, { 'type/id': 191 }],
			childConditions: [{ 'questions/questionId': '1597' }],
			orderBy: { key: 'name' },
		}),
		getConfigurations({
			fields: ['id', 'name', 'type', 'notes'],
			conditions: [{ 'company/id': Number(params.id) }, { 'status/id': 2 }, { 'type/id': 'in (211, 212, 219)' }],
			orderBy: { key: 'name' },
		}),
	]);

	return (
		<main className='h-full bg-muted/15'>
			<ResizablePanelGroup direction='horizontal'>
				<ResizablePanel>
					<ScrollArea className='grid min-h-0 px-3'>
						<div className='max-w-3xl w-full mx-auto py-10 grid items-start'>
							<form action=''>
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
							</form>

							<Separator />

							<Accordion type='multiple'>
								<AccordionItem value='activity'>
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

											<TabsContent value='quickView'></TabsContent>

											<TabsContent value='servers'>
												<Table className='p-3'>
													<TableHeader>
														<TableRow>
															{/* <TableHead>Name</TableHead> */}
															<TableHead>Type</TableHead>
															<TableHead>List</TableHead>
														</TableRow>
													</TableHeader>

													<TableBody>
														{Object.entries(groupBy(servers, ({ type }) => type.name))?.map(
															([type, servers], index) => (
																<TableRow key={type}>
																	<TableCell className='font-semibold'>{type}</TableCell>
																	<TableCell className='text-wrap'>
																		{servers.map((server) => server.name).join(', ')}
																	</TableCell>
																</TableRow>
															)
														)}
														{/* {servers.map((server) => (
															<TableRow key={server.id}>
																<TableCell>Name</TableCell>
																<TableCell>{server.types}</TableCell>
																<TableCell>List</TableCell>
															</TableRow>
														))} */}
													</TableBody>
												</Table>
											</TabsContent>

											<TabsContent value='applications'>
												<Table className='p-3'>
													<TableHeader>
														<TableRow>
															{/* <TableHead>Name</TableHead> */}
															<TableHead>Type</TableHead>
															<TableHead>List</TableHead>
														</TableRow>
													</TableHeader>

													<TableBody>
														{Object.entries(groupBy(applications, ({ type }) => type.name))?.map(
															([type, servers], index) => (
																<TableRow key={type}>
																	<TableCell className='font-semibold'>{type}</TableCell>
																	<TableCell className='text-wrap'>
																		{servers.map((server) => server.name).join(', ')}
																	</TableCell>
																</TableRow>
															)
														)}
														{/* {servers.map((server) => (
															<TableRow key={server.id}>
																<TableCell>Name</TableCell>
																<TableCell>{server.types}</TableCell>
																<TableCell>List</TableCell>
															</TableRow>
														))} */}
													</TableBody>
												</Table>
											</TabsContent>
										</Tabs>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</div>
					</ScrollArea>
				</ResizablePanel>

				<ResizableHandle />

				<ResizablePanel
					minSize={24}
					defaultSize={27}
					maxSize={45}
				>
					<div className='h-full'>
						<div className='py-6 space-y-7'>
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
								<h4 className='text-xs text-muted-foreground font-medium px-3'>Projects</h4>
							</section>

							<section>
								<h4 className='text-xs text-muted-foreground font-medium px-3'>Board</h4>

								<Suspense fallback={<Skeleton className='w-full h-9' />}>
									{/* <BoardSelector board={ticket.board} /> */}
								</Suspense>
							</section>

							<section>
								<h4 className='text-xs text-muted-foreground font-medium px-3'>Company</h4>

								<Suspense fallback={<Skeleton className='w-full h-9' />}>
									{/* <CompanySelector company={ticket.company} /> */}
								</Suspense>

								<Suspense fallback={<Skeleton className='w-full h-9' />}>
									{/* <ContactSelector
										company={ticket.company}
										contact={ticket.contact}
									/> */}
								</Suspense>
							</section>

							<Separator />

							<section>
								<h4 className='text-xs text-muted-foreground font-medium px-3'>Due Date</h4>

								{/* <DatePicker date={ticket?.requiredDate ? new Date(ticket?.requiredDate) : new Date()} /> */}
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
