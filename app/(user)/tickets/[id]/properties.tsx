import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import DatePicker from '@/components/ui/date-picker';
import { Separator } from '@/components/ui/separator';
import { Paperclip, Tag } from 'lucide-react';
import React, { Suspense } from 'react';
import StatusSelector from './status-selector';
import { ServiceTicket } from '@/lib/manage/types';
import MemberSelector from './member-selector';
import BoardSelector from './board-selector';
import PrioritySelector from './priority-selector';
import { Skeleton } from '@/components/ui/skeleton';
import CompanySelector from './company-selector';
import ContactSelector from './contact-selector';
import { getDocuments } from '@/lib/manage/read';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default async function Properties({ ticket }: { ticket: ServiceTicket }) {
	const attachments = await getDocuments(ticket.id);

	console.log(ticket.board);

	return (
		<div className='pl-3 pb-6 pt-2.5 pr-1.5 space-y-7'>
			<section>
				<Suspense>
					<StatusSelector
						board={ticket.board}
						status={ticket.status}
					/>
				</Suspense>

				<Suspense>
					<PrioritySelector priority={ticket.priority} />
				</Suspense>

				<Suspense>
					<MemberSelector member={ticket.owner} />
				</Suspense>
			</section>

			<section>
				<h4 className='text-xs text-muted-foreground font-medium px-3'>Labels</h4>

				<Combobox
					items={[]}
					side='left'
					align='start'
				>
					<Button
						size='sm'
						variant='ghost'
						className='flex'
					>
						<Tag className='mr-1.5' /> <span className='text-xs text-muted-foreground'>Add label</span>
					</Button>
				</Combobox>
			</section>

			<section>
				<h4 className='text-xs text-muted-foreground font-medium px-3'>Board</h4>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<BoardSelector board={ticket.board} />
				</Suspense>
			</section>

			<section>
				<h4 className='text-xs text-muted-foreground font-medium px-3'>Company</h4>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<CompanySelector company={ticket.company} />
				</Suspense>

				<Suspense fallback={<Skeleton className='w-full h-9' />}>
					<ContactSelector
						company={ticket.company}
						contact={ticket.contact}
					/>
				</Suspense>
			</section>

			<Separator />

			<section>
				<h4 className='text-xs text-muted-foreground font-medium px-3'>Due Date</h4>

				<DatePicker date={ticket?.requiredDate ? new Date(ticket?.requiredDate) : new Date()} />
			</section>

			<Separator />

			<section>
				<h4 className='text-xs text-muted-foreground font-medium px-3'>Attachments</h4>

				{attachments
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
					))}
			</section>

			{/* <style
				dangerouslySetInnerHTML={{
					__html: `
html {
  box-sizing: border-box;
  touch-action: pan-x pan-y;
  background-color: #ececec;
  height: 100%;
  border: 0px;
  font-size: inherit;
  font-family: inherit;
  font-weight: inherit;
  line-height: inherit;
  vertical-align: baseline;
  margin: 0px;
  padding: 0px;
  width: 100%;
  -webkit-tap-highlight-color: transparent;
  position: fixed;
  overflow: hidden;
}

body {
  box-sizing: border-box;
  touch-action: pan-x pan-y;
  height: 100%;
  border: 0px;
  font-size: inherit;
  font-weight: inherit;
  vertical-align: baseline;
  margin: 0px;
  padding: 0px;
  width: 100%;
  -webkit-tap-highlight-color: transparent;
  font-family: "Inter UI","SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizelegibility;
  text-size-adjust: 100%;
  position: fixed;
  overflow: hidden;
  user-select: none;
  cursor: default;
}
`,
				}}
			/> */}
		</div>
	);
}
