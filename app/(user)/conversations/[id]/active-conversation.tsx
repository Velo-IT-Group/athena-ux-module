import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

type Props = {
	className?: string;
};

const ConversationDetails = async ({ className }: Props) => {
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
			</Tabs>
		</div>
	);
};

export default ConversationDetails;
