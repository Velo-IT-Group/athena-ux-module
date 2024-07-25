import { buttonVariants } from '@/components/ui/button';
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
import { getCompanies } from '@/lib/manage/read';
import CompanyTooltipDetail from './company-tooltip-detail';
import parsePhoneNumber from 'libphonenumber-js';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Props = {};

const Page = async (props: Props) => {
	const companies = await getCompanies();

	return (
		<div className='p-3 space-y-3'>
			<h1 className='text-2xl font-bold'>Companies</h1>

			<Table>
				<TableCaption>A list of your recent invoices.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className='w-[100px]'>ID</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Phone Number</TableHead>
						<TableHead>Territory</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{companies.map((company) => {
						const number = parsePhoneNumber(company.phoneNumber, 'US');

						return (
							<TableRow key={company.id}>
								<TableCell className='font-medium'>{company.identifier}</TableCell>

								<Tooltip>
									<TooltipTrigger asChild>
										<TableCell>
											<Link
												href={`/companies/${company.id}`}
												className='font-medium'
											>
												{company.name}
											</Link>
										</TableCell>
									</TooltipTrigger>

									<CompanyTooltipDetail
										name={company.name}
										phoneNumber={company.phoneNumber}
									/>
								</Tooltip>

								<TableCell>
									<span className={cn(buttonVariants({ variant: 'link' }), 'px-0')}>{number?.format('NATIONAL')}</span>
								</TableCell>

								<TableCell>{company?.territory?.name}</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell colSpan={3}>Total</TableCell>
						<TableCell className='text-right'>$2,500.00</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</div>
	);
};

export default Page;
