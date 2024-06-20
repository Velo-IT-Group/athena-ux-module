import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
	className?: string;
};

const DialpadIcon = ({ className }: Props) => {
	return (
		<svg
			width='24'
			height='24'
			viewBox='0 0 24 24'
			className={cn('Twilio-Icon-Content', className)}
		>
			<path
				d='M8 7a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2zm-8 4a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2zm-8 4a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2zm-4 4a1 1 0 110-2 1 1 0 010 2z'
				fill='currentColor'
				stroke='none'
				stroke-width='2'
				fill-rule='evenodd'
			/>
		</svg>
	);
};

export default DialpadIcon;
