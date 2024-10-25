import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Globe, MapPin, NotebookPen, Phone, PlusCircle, User } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import parsePhoneNumber from 'libphonenumber-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConfigurationsList from '@/components/lists/configurations-list';
import getQueryClient from '@/app/getQueryClient';
import type { Company, Note, Site } from '@/types/manage';
import Tiptap from '@/components/tip-tap';
import { Conditions } from '@/utils/manage/params';

type Props = {
	params: Promise<{ id: number }>;
};

const Page = async ({ params }: Props) => {
	const { id } = await params;
	const client = getQueryClient();
	const [company, notes, sites] = await Promise.all([
		client.fetchQuery<Company>({ queryKey: [`/company/companies/${id}`] }),
		client.fetchQuery<Note[]>({
			queryKey: [`/company/companies/${id}/notes`, { fields: ['id', 'text', 'type'] } as Conditions<Note>],
		}),
		client.fetchQuery<Site[]>({ queryKey: [`/company/companies/${id}/sites`] }),
	]);

	return (
		<main className='grid grid-cols-[1fr_280px] items-start gap-3 h-full grow bg-muted/15'>
			<ScrollArea className='grid min-h-0 h-full overflow-y-auto'>
				<div className='max-w-3xl w-full mx-auto py-10 grid items-start'>
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

					<h2 className='text-lg font-semibold'>SOP Exceptions</h2>

					<Tiptap content={notes.find((note) => note.type.id === 6)?.text} />

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
									asChild
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

											<Tiptap
												// className='w-full resize-none border-none shadow-none'
												content={note.text}
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
										<ConfigurationsList
											type='table'
											params={{
												conditions: {
													'company/id': Number(id),
													'status/id': 2,
													'type/id': 191,
												},
												childConditions: { 'questions/questionId': '1597' },
												orderBy: { key: 'name' },
												fields: ['id', 'name', 'type', 'notes', 'contact', 'status', 'site'],
											}}
											definition={{ page: '' }}
										/>
									</TabsContent>

									<TabsContent value='servers'>
										<ConfigurationsList
											type='table'
											definition={{ page: '' }}
											params={{
												conditions: {
													'company/id': Number(id),
													'status/id': 2,
													'type/id': 191,
												},
												childConditions: { 'questions/questionId': '1597' },
												orderBy: { key: 'name' },
												fields: ['id', 'name', 'contact', 'status', 'site'],
											}}
										/>
									</TabsContent>

									<TabsContent value='applications'>
										<ConfigurationsList
											type='table'
											definition={{ page: '' }}
											params={{
												conditions: {
													'company/id': Number(id),
													'status/id': 2,
													'type/id': 'in (211, 212, 219)',
												},
												orderBy: { key: 'name' },
												fields: ['id', 'name', 'type', 'notes', 'contact', 'status', 'site'],
											}}
										/>
									</TabsContent>
								</Tabs>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</ScrollArea>

			<div className='border-l h-full'>
				<div className='pb-6 pt-2.5 pr-1.5 space-y-6 min-h-[calc(100vh-49px)]'>
					<section className='grid px-3'>
						<div className='grid grid-cols-4 items-center h-9'>
							<Label className='text-nowrap text-xs font-normal'>Stoplight</Label>

							<div className='col-span-3'>
								{company?.types?.some((type) => type.id === 57) && (
									<Badge
										className='mx-1.5 rounded-md'
										variant='success'
									>
										Green
									</Badge>
								)}
								{company?.types?.some((type) => type.id === 56) && (
									<Badge
										className='mx-1.5 rounded-md'
										variant='destructive'
									>
										Red
									</Badge>
								)}
								{company?.types?.some((type) => type.id === 55) && (
									<Badge
										className='mx-1.5 rounded-md'
										variant={'caution'}
									>
										Yellow
									</Badge>
								)}
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
		</main>
	);
};

export default Page;
