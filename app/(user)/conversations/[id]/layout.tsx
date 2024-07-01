import { ReactNode } from 'react';
import { TwilioTaskContext } from './task-context';

type Props = {
	children: ReactNode;
};

const Layout = async ({ children }: Props) => {
	return <TwilioTaskContext>{children}</TwilioTaskContext>;
};

export default Layout;
