import { Button, buttonVariants } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip';
import { getContacts } from '@/lib/manage/read';
import parsePhoneNumber from 'libphonenumber-js';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Eye, Flag, LinkIcon, Plus, Sparkle } from 'lucide-react';
import Link from 'next/link';
import { Combobox } from '@/components/ui/combobox';

type Props = {};

const Page = async (props: Props) => {
	const contacts = await getContacts(250);

	return (
		<div className='p-9 space-y-3 bg-muted/50'>
			<h1 className='text-2xl font-bold'>Contacts</h1>

			<div className='grid grid-cols-[1fr_240px] items-start gap-3'>
				<Card>
					<Table>
						<CardHeader className='border-b bg-muted/25'>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Company</TableHead>
									<TableHead>Phone Number</TableHead>
									<TableHead>Territory</TableHead>
								</TableRow>
							</TableHeader>
						</CardHeader>

						<CardContent>
							<TableBody>
								{contacts.map((contact) => {
									const number = contact.defaultPhoneNbr ? parsePhoneNumber(contact.defaultPhoneNbr, 'US') : null;
									const comms = contact?.communicationItems?.filter((item) => item.communicationType === 'Email');

									return (
										<TableRow key={contact.id}>
											<TableCell className='font-medium'>
												{contact.firstName} {contact.lastName}
											</TableCell>

											<Tooltip>
												<TooltipTrigger asChild>
													<TableCell>
														<Link
															href={`/companies/${contact.id}`}
															className='font-medium'
														>
															{contact.company?.name}
														</Link>
													</TableCell>
												</TooltipTrigger>
											</Tooltip>

											<TableCell>
												<span className={cn(buttonVariants({ variant: 'link' }), 'px-0')}>
													{number?.isValid && number?.format('NATIONAL')}
												</span>
											</TableCell>

											<TableCell>{comms?.map((comm) => comm.value).join(', ')}</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</CardContent>

						<TableFooter>
							<CardFooter>
								<TableRow>
									<TableCell colSpan={3}>Total</TableCell>
									<TableCell className='text-right'>$2,500.00</TableCell>
								</TableRow>
							</CardFooter>
						</TableFooter>
					</Table>
				</Card>

				<Card>
					<CardContent className='p-1.5 space-y-1.5'>
						<Input placeholder='Serach by name or ID...' />

						<Combobox
							items={[
								{
									label: (
										<div className='flex items-center gap-1.5'>
											<Flag /> <span>Country</span>
										</div>
									),
									value: 'Country',
								},
								{
									label: (
										<div className='flex items-center gap-1.5'>
											<LinkIcon /> <span>Referrer</span>
										</div>
									),
									value: 'referrer',
								},
								{
									label: (
										<div className='flex items-center gap-1.5'>
											<Sparkle /> <span>Custom event</span>
										</div>
									),
									value: 'custom',
								},
								{
									label: (
										<div className='flex items-center gap-1.5'>
											<Eye /> <span>Page view</span>
										</div>
									),
									value: 'page',
								},
							]}
							placeholder='Filter by...'
							align='center'
						>
							<Button
								variant='outline'
								className='w-full'
							>
								<Plus className='mr-1.5' />

								<span>Add filter</span>
							</Button>
						</Combobox>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Page;
