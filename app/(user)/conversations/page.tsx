import { ActiveConversation } from '@/components/active-conversation';
import TaskList from '@/components/task-list';
import React from 'react';

type Props = {};

const Page = (props: Props) => {
	return (
		<main className='grid grid-cols-[1fr_3fr] min-h-screen'>
			<TaskList />

			<ActiveConversation />
		</main>
	);
};

export default Page;
