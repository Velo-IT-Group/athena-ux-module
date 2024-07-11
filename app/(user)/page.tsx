import { DataItem, Overview } from './overview';
import { groupBy } from 'lodash';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { getInboundCalls } from '@/lib/twilio/read';
import { type ChartConfig } from '@/components/ui/chart';
import BarChart from '@/components/bar-chart';

const chartConfig = {
	desktop: {
		label: 'This Month',
		color: '#2563eb',
	},
	mobile: {
		label: 'Last Month',
		color: '#60a5fa',
	},
} satisfies ChartConfig;

const chartData = [
	{ month: 'January', desktop: 186, mobile: 80 },
	{ month: 'February', desktop: 305, mobile: 200 },
	{ month: 'March', desktop: 237, mobile: 120 },
	{ month: 'April', desktop: 73, mobile: 190 },
	{ month: 'May', desktop: 209, mobile: 130 },
	{ month: 'June', desktop: 214, mobile: 140 },
];
import { DateRangePicker } from '@/components/ui/date-range-picker';

export default async function Page({ searchParams }: { searchParams: any }) {
	const calls = await getInboundCalls('client:nblack_40velomethod_2Ecom', searchParams.from, searchParams.to);

	const groupedCalls = groupBy(calls, ({ dateCreated }) =>
		Intl.DateTimeFormat('en-US', { dateStyle: 'short' }).format(dateCreated)
	);

	const data: DataItem[] = Object.entries(groupedCalls).map(([name, value]) => {
		return {
			name,
			value: value.length,
		};
	});

	return (
		<div>
			<main className='grid grid-cols-3 gap-3 p-3'>
				<Card>
					<CardHeader>
						<CardTitle className='text-xs font-medium'>Horses</CardTitle>
					</CardHeader>

					<CardContent>
						<p className='text-xl'>12</p>
					</CardContent>
				</Card>

				<div className='bg-yellow-300 rounded-lg'></div>

				<div className='bg-yellow-300 rounded-lg'></div>

				<Card className='bg-secondary col-span-2'>
					<CardHeader className='justify-between items-center flex-row space-y-0'>
						<CardTitle>Calls</CardTitle>

						<DateRangePicker className='w-auto' />
					</CardHeader>

					<CardContent className='bg-card rounded-lg'>
						{/* <Overview data={data} /> */}
						<BarChart
							config={chartConfig}
							data={chartData}
							dataKey={['desktop', 'mobile']}
						/>
					</CardContent>
				</Card>

				<div className='bg-yellow-300 rounded-lg'></div>

				<Card className='col-span-3'>
					<CardHeader className='p-3'>
						<CardTitle className='text-base'>Call History</CardTitle>
					</CardHeader>

					<CardContent className='px-3'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableCell>
										<span>Hey</span>
									</TableCell>
								</TableRow>
							</TableHeader>
						</Table>
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
