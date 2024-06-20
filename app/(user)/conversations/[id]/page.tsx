import { ActiveConversation } from '@/components/active-conversation';
import TaskList from '@/components/task-list';
import React from 'react';

type Props = {
	params: { id: string };
};

const Page = ({ params }: Props) => {
	return (
		<main className='grid grid-cols-[1fr_3fr]'>
			<TaskList />

			<ActiveConversation />
		</main>
	);
};

export default Page;
