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
import { getEvents } from '@/lib/twilio/taskrouter/helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { auth } from '@/auth';
import { cn } from '@/lib/utils';
import { PhoneIncoming, Smile } from 'lucide-react';
import Metric from './metric';
import { ServiceLevel } from './service-level';
import { CallVolume } from './call-volume';

export default async function Page({ searchParams }: { searchParams: any }) {
	const session = await auth();

	return (
		<main className='grid gap-3 p-3'>
			<Card>
				<CardHeader className='bg-muted/50 grid grid-cols-5 items-start gap-6 pb-0 space-y-0'>
					<Metric
						icon={<PhoneIncoming className='w-6 h-6' />}
						title='Incoming Calls'
						subtitle='Last 7 days'
						value='526'
						prevValue='497'
						timeline='prev. 7 days'
					/>

					<Metric
						icon={<PhoneIncoming className='w-6 h-6' />}
						title='Answered Calls'
						subtitle='Last 7 days'
						value='554'
						prevValue='548'
						timeline='prev. 7 days'
					/>

					<Metric
						icon={<PhoneIncoming className='w-6 h-6' />}
						title='Abandoned Calls'
						subtitle='Last 7 days'
						value='25'
						prevValue='22'
						timeline='prev. 7 days'
					/>

					<div className='border-l pl-6 col-span-2 flex items-center'>
						<ServiceLevel />

						<Metric
							icon={<Smile className='w-6 h-6' />}
							title='Average CSAT'
							subtitle='All time'
							value='4.7 of 5'
							prevValue='497'
							timeline='All time'
						/>
					</div>
				</CardHeader>

				<CardContent>
					<CallVolume />
				</CardContent>
			</Card>

			<div className='grid grid-cols-[2fr_1fr] gap-3'>
				<Card>
					<CardHeader>
						<CardTitle>Best Agents This Week</CardTitle>
					</CardHeader>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Reason For Calls</CardTitle>
					</CardHeader>
				</Card>
			</div>
		</main>
		// <div className='grid grid-cols-[1fr_6rem] items-start gap-3'>

		// 	<aside className='grid place-items-center gap-3 pr-4 h-full'>
		// 		<div className='space-y-1.5'>
		// 			<div className='bg-blue-500 rounded-full h-[4rem] w-[4rem] grid place-items-center text-primary-foreground text-xl'>
		// 				25
		// 			</div>

		// 			<p className='font-semibold text-sm text-center'>
		// 				Calls
		// 				<br />
		// 				active
		// 			</p>
		// 		</div>

		// 		<div className='space-y-1.5'>
		// 			<div className='bg-orange-400 rounded-full h-[4rem] w-[4rem] grid place-items-center text-primary-foreground text-xl'>
		// 				7
		// 			</div>
		// 			<p className='font-semibold text-sm text-center'>
		// 				Calls
		// 				<br />
		// 				waiting
		// 			</p>
		// 		</div>

		// 		<div className='space-y-1.5'>
		// 			<div className='bg-gray-300 rounded-full h-[4rem] w-[4rem] grid place-items-center text-primary-foreground text-xl'>
		// 				4
		// 			</div>
		// 			<p className='font-semibold text-sm text-center'>
		// 				Calls
		// 				<br />
		// 				on hold
		// 			</p>
		// 		</div>

		// 		<div className='space-y-1.5'>
		// 			<div className='relative h-[4rem] w-[4rem]'>
		// 				{new Array(3).fill(null).map((_, index) => (
		// 					<Avatar
		// 						key={index}
		// 						className={cn(
		// 							'absolute border-2 border-white w-9 h-9',
		// 							index === 0
		// 								? 'bottom-0 left-0 z-0'
		// 								: index === 1
		// 								? 'top-0 left-[14px] right-[14px] bottom-auto z-10'
		// 								: 'bottom-0 right-0 z-20'
		// 						)}
		// 					>
		// 						{index === 2 && (
		// 							<div className='absolute inset-0 bg-black/50 z-10 text-white text-xs grid place-items-center'>
		// 								+25
		// 							</div>
		// 						)}
		// 						<AvatarImage
		// 							className={'relative'}
		// 							src={session?.user?.image ?? undefined}
		// 						/>
		// 						<AvatarFallback className={cn(index === 2 && '')}>NB</AvatarFallback>
		// 					</Avatar>
		// 				))}
		// 			</div>
		// 			<p className='font-semibold text-sm text-center'>
		// 				Agents
		// 				<br />
		// 				online
		// 			</p>
		// 		</div>
		// 	</aside>
		// </div>
	);
}
