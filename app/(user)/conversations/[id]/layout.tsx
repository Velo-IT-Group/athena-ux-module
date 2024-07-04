import { ReactNode } from 'react';
import { TwilioTaskContext } from './task-context';
import { getTask } from '@/lib/twilio/taskrouter/helpers';

type Props = {
	children: ReactNode;
	params: { id: string };
};

const Layout = async ({ children, params }: Props) => {
	const task = await getTask(params.id);

	return <TwilioTaskContext task={task}>{children}</TwilioTaskContext>;
};

export default Layout;
