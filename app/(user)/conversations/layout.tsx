import { ReactNode } from 'react';

type Props = {
	children: ReactNode;
	params: string[];
};

const Layout = ({ children, params }: Props) => {
	return <>{children}</>;
};

export default Layout;
