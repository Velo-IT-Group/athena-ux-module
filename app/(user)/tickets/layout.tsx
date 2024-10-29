'use client';
import React, { ReactNode, useState } from 'react';
import Navbar from '@/components/navbar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Layers, Plus, Ticket, TicketPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

type Props = {
	children: ReactNode;
};

const Layout = ({ children }: Props) => {
	const [open, setOpen] = useState(false);

	return (
		<main>
			<Navbar
				title='Tickets'
				items={[
					{
						title: 'All tickets',
						href: '/tickets/all',
						// icon: 'Ticket',
					},
				]}
			>
				<Popover
					open={open}
					onOpenChange={setOpen}
				>
					<PopoverTrigger asChild>
						<Button
							variant='ghost'
							size='sm'
							className='h-auto inline-flex items-center border border-transparent px-2.5 py-0.5 text-xs transition-colors text-foreground rounded-sm font-medium space-x-1.5'
						>
							<Layers className='inline-block' />
							<span>New view</span>
						</Button>
					</PopoverTrigger>

					<PopoverContent
						align='start'
						side='bottom'
						className='w-80'
					>
						<form>
							<Input
								className='shadow-none text-base border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none px-0'
								placeholder='All tickets'
								autoFocus
							/>

							<Input
								className='shadow-none border-none text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none px-0'
								placeholder='Description (optional)'
							/>

							<Separator className='my-1.5' />

							<div className='flex items-center justify-end gap-1.5'>
								<Button
									variant='ghost'
									size='sm'
									type='button'
									onClick={() => setOpen(false)}
								>
									Cancel
								</Button>

								<Button size='sm'>Save</Button>
							</div>
						</form>
					</PopoverContent>
				</Popover>

				<Dialog>
					<DialogTrigger asChild>
						<Button
							variant='ghost'
							size='sm'
							className='ml-auto h-auto inline-flex items-center border border-transparent px-2.5 py-0.5 text-xs transition-colors text-foreground rounded-sm font-medium space-x-1.5'
						>
							<Plus className='inline-block' />
							<span>Create ticket</span>
						</Button>
					</DialogTrigger>

					<DialogContent>
						<form>
							<DialogHeader>
								<DialogTitle>New Ticket</DialogTitle>
							</DialogHeader>

							<div className='py-3'>
								<Input
									autoFocus
									placeholder='Ticket summary'
									className='text-xl font-medium h-auto border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:opacity-75'
								/>

								<Input
									autoFocus
									placeholder='Add a short summary...'
									className='h-auto border-none font-light px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:opacity-50'
								/>
							</div>

							<DialogFooter>
								<DialogClose asChild>
									<Button
										variant='secondary'
										type='button'
									>
										Cancel
									</Button>
								</DialogClose>

								<Button>Create ticket</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</Navbar>
			{children}
		</main>
	);
};

export default Layout;
