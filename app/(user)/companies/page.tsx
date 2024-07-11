import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import GroupedAvatar from '@/components/ui/grouped-avatar';
import { Separator } from '@/components/ui/separator';
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getCompanies } from '@/lib/manage/read';
import { Copy, Ellipsis, Mail, PhoneOutgoing } from 'lucide-react';

type Props = {};

const Page = async (props: Props) => {
	const companies = await getCompanies();
	return (
		<Table>
			<TableCaption>A list of your recent invoices.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className='w-[100px]'>Invoice</TableHead>
					<TableHead>Status</TableHead>
					{/* <TableHead>Method</TableHead>
					<TableHead className='text-right'>Amount</TableHead> */}
				</TableRow>
			</TableHeader>
			<TableBody>
				{companies.map((company) => (
					<TableRow key={company.id}>
						<TableCell className='font-medium'>{company.identifier}</TableCell>
						<Tooltip>
							<TooltipTrigger>
								<TableCell>{company.name}</TableCell>
							</TooltipTrigger>

							<TooltipContent
								align='start'
								side='bottom'
								className='flex items-center gap-3 bg-black text-white'
							>
								<Button
									variant='ghost'
									size='sm'
								>
									<Copy className='mr-1.5' />
									<span>Copy</span>
								</Button>

								<Separator
									orientation='vertical'
									className='h-4'
								/>

								<Button
									variant='ghost'
									size='sm'
								>
									<PhoneOutgoing className='mr-1.5' />
									<span>Call</span>
								</Button>

								<Separator
									orientation='vertical'
									className='h-4'
								/>

								<Button
									variant='ghost'
									size='sm'
								>
									<Mail className='mr-1.5' />
									<span>Send Email</span>
								</Button>

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant='outline'
											size='sm'
											className='bg-black text-white'
										>
											<Ellipsis />
										</Button>
									</DropdownMenuTrigger>

									<DropdownMenuContent>
										<DropdownMenuItem>Testing</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TooltipContent>
						</Tooltip>

						{/* <TableCell>{company.paymentMethod}</TableCell>
						<TableCell className='text-right'>{company.totalAmount}</TableCell> */}
					</TableRow>
				))}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell colSpan={3}>Total</TableCell>
					<TableCell className='text-right'>$2,500.00</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	);
};

export default Page;
