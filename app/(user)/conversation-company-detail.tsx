import { Building } from 'lucide-react';
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCompany, getTickets } from '@/lib/manage/read';
import { Badge } from '@/components/ui/badge';

type Props = {
	companyId?: number;
};

const ConversationCompanyDetail = async ({ companyId: id }: Props) => {
	const [company, { tickets, count }] = await Promise.all([getCompany(id ?? 250), getTickets()]);

	return (
		<aside className='min-h-0 flex flex-col overflow-y-scroll space-y-6 p-3 bg-background border-l'>
			<header className='space-y-3'>
				<h2 className='font-medium'>Company</h2>

				<div className='flex items-center gap-3'>
					<div className='bg-muted rounded-full p-3'>
						<Building className='h-6 w-6' />
					</div>

					<div>
						<p className='font-medium'>{company.name}</p>
						{/* @ts-ignore */}
						<p className='text-xs text-muted-foreground'>{company?.website}</p>
					</div>
				</div>
			</header>

			<Accordion type='multiple'>
				<AccordionItem value='active-projects'>
					<section>
						<AccordionTrigger>
							<h3 className='font-medium'>Active Projects</h3>
						</AccordionTrigger>

						<AccordionContent>
							<Card>
								<p>Proejct 1</p>
							</Card>
						</AccordionContent>
					</section>
				</AccordionItem>

				<AccordionItem value='tickets'>
					<section>
						<AccordionTrigger>
							<h3 className='font-medium'>
								Tickets <Badge>{tickets.length}</Badge>
							</h3>
						</AccordionTrigger>

						<AccordionContent className='space-y-3'>
							{tickets?.map((ticket) => (
								<Card key={ticket.id}>
									<CardHeader className='p-3'>
										<CardTitle className='text-sm'>{ticket.summary}</CardTitle>
										<CardDescription className='text-xs'>{ticket.dateResponded}</CardDescription>
									</CardHeader>
								</Card>
							))}
						</AccordionContent>
					</section>
				</AccordionItem>
			</Accordion>
		</aside>
	);
};

export default ConversationCompanyDetail;
