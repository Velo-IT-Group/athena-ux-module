import ConversationDetails from './[id]/active-conversation';
import TaskList from '@/components/lists/task-list';
import React from 'react';

type Props = {};

const Page = (props: Props) => {
	return (
		<main className='grid grid-cols-[1fr_3fr]'>
			<TaskList />

			<ConversationDetails />
		</main>
	);
};

export default Page;
