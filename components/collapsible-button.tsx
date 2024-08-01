'use client';
import { collapsedState } from '@/atoms/sidebarStateAtom';
import { useRecoilState } from 'recoil';
import { Button } from './ui/button';
import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';

type Props = {};

const CollapsibleButton = (props: Props) => {
	const [isCollapsed, setIsCollapsed] = useRecoilState(collapsedState);

	return (
		<Button
			variant={'ghost'}
			size={'icon'}
			className='text-muted-foreground border'
			onClick={() => setIsCollapsed((prev) => !prev)}
		>
			{isCollapsed ? <ArrowRightFromLine /> : <ArrowLeftFromLine />}
		</Button>
	);
};

export default CollapsibleButton;
