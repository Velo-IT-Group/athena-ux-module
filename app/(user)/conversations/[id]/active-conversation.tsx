import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Computer, PhoneIncoming, PhoneOutgoing } from 'lucide-react';
import ConfigurationsList from './configurations-list';
import { getConfigurations } from '@/lib/manage/read';
import TicketList from '@/components/ticket-list';
import { getAllCalls } from '@/lib/twilio/read';
import { CommunicationItem } from '@/types/manage';
import { cn, parsePhoneNumber } from '@/lib/utils';
import { CallInstance } from 'twilio/lib/rest/api/v2010/account/call';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/auth';
import ActivityList from '@/components/activity-list';
import { Suspense } from 'react';
import TableSkeleton from '@/components/ui/data-table/skeleton';

type Props = {
	contactId?: number;
	className?: string;
	communicationItems?: CommunicationItem[];
};

const ConversationDetails = async ({ contactId: userId, className, communicationItems }: Props) => {
	const [configurations, session] = await Promise.all([
		getConfigurations({ conditions: userId ? [{ parameter: { 'contact/id': userId } }] : [] }),
		auth(),
	]);

	const [calls] = await Promise.all(
		communicationItems?.length
			? communicationItems
					?.filter((item) => item.communicationType === 'Phone' && parsePhoneNumber(item.value).isValid)
					.map((item) => getAllCalls(item.value))
			: []
	);

	const tabs = ['Overview', 'Attachments', 'Configurations', 'Tickets'];

	return (
		<div className={cn('w-full overflow-x-hidden', className)}>
			<Tabs defaultValue={tabs[3]}>
				<TabsList className='w-full'>
					{tabs.map((tab) => (
						<TabsTrigger
							className='w-full'
							value={tab}
							key={tab}
						>
							{tab}
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value={tabs[0]}>
					<ActivityList
						activities={(calls as CallInstance[])
							?.sort((a, b) => {
								if (a.dateUpdated.getTime() < b.dateUpdated.getTime()) return 1;
								if (a.dateUpdated.getTime() > b.dateUpdated.getTime()) return -1;
								return 0;
							})
							.map((call: CallInstance) => {
								const isInbound = call.direction === 'inbound';
								return {
									icon: isInbound ? PhoneIncoming : PhoneOutgoing,
									date: call.endTime,
									text: `${
										isInbound ? call.fromFormatted : session?.user.email === call.toFormatted ? 'You' : call.toFormatted
									}
												called ${isInbound ? call.toFormatted : call.fromFormatted}`,
								};
							})}
					/>
				</TabsContent>

				<TabsContent value={tabs[2]}>
					{configurations.length ? (
						<ConfigurationsList configurations={configurations} />
					) : (
						<div className='grow grid place-items-center gap-3 p-6'>
							<Computer className='w-9 h-9' />

							<h1 className='text-xl font-semibold'>No Configurations</h1>
						</div>
					)}
				</TabsContent>

				<TabsContent value={tabs[3]}>
					<Suspense>
						<Card>
							<CardHeader>
								<CardTitle>Tickets</CardTitle>
							</CardHeader>

							<CardContent className='p-3'>
								<Suspense fallback={<TableSkeleton />}>
									<TicketList
										type='table'
										params={{ conditions: userId ? [{ parameter: { 'contact/id': userId } }] : [] }}
									/>
								</Suspense>
							</CardContent>
						</Card>
					</Suspense>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default ConversationDetails;
