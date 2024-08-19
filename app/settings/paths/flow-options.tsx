import React from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon, Eye, TrashIcon } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { FlowInstance } from 'twilio/lib/rest/studio/v2/flow';
import { Copy } from 'lucide-react';
import Link from 'next/link';

const FlowOptions = ({ flow }: { flow: FlowInstance }) => {
	return (
		<Dialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='secondary'
						className='px-2 shadow-none'
					>
						<ChevronDownIcon className='h-3.5 w-3.5 text-secondary-foreground' />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					align='end'
					alignOffset={-5}
					className='w-[200px]'
					forceMount
				>
					<DropdownMenuLabel>Options</DropdownMenuLabel>

					<DropdownMenuItem asChild>
						<Link href={`/settings/paths/${flow.sid}`}>
							<Eye className='mr-2 h-3.5 w-3.5' /> Preview
						</Link>
					</DropdownMenuItem>

					<DropdownMenuItem>
						<Copy className='mr-2 h-3.5 w-3.5' /> Duplicate
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DialogTrigger asChild>
						<DropdownMenuItem className='text-red-600 focus:text-red-600 focus:bg-red-50'>
							<TrashIcon className='mr-2 h-3.5 w-3.5' /> Delete
						</DropdownMenuItem>
					</DialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. Are you sure you want to permanently delete this file from our servers?
					</DialogDescription>
				</DialogHeader>

				<form
				// action={async () => {
				// 	try {
				// 		// await deleteProposal(proposal.id);
				// 		// setOpen(false);
				// 	} catch (error) {
				// 		toast('Error deleting the proposal...', { important: true });
				// 	}
				// }}
				>
					<DialogFooter>
						<Button>Confirm</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default FlowOptions;
