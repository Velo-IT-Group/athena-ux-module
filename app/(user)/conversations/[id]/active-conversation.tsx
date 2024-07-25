import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Computer, Search, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ConfigurationsList from './configurations-list';
import { getConfigurations, getUserTickets } from '@/lib/manage/read';
import TicketList from './ticket-list';

type Props = {
	userId?: number;
	className?: string;
};

const ConversationDetails = async ({ userId, className }: Props) => {
	const [configurations] = await Promise.all([getConfigurations(userId)]);
	const tabs = ['Activities', 'Attachments', 'Configurations', 'Tickets'];

	return (
		<div className={className}>
			<div className='flex items-center gap-3 text-muted-foreground border-b'>
				<Search />

				<Input
					className='border-none border-b bg-transparent px-0 h-auto'
					placeholder='Search activity, notes, email and more...'
				/>
			</div>

			<Tabs defaultValue={tabs[0]}>
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

				<TabsContent value={tabs[0]}></TabsContent>

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
					{/* {tickets.length ? (
						<TicketList tickets={[]} />
					) : (
						<div className='grow grid place-items-center gap-3 p-6'>
							<Tag className='w-9 h-9' />

							<h1 className='text-xl font-semibold'>No Tickets</h1>
						</div>
					)} */}
					<TicketList tickets={[]} />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default ConversationDetails;
