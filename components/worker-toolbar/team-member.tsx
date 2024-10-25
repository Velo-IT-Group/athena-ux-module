import { Smartphone } from 'lucide-react';
import React from 'react';

type Props = {
	title: string;
	subtitle?: string;
};

const TeamMember = ({ title, subtitle }: Props) => {
	return (
		<div className='flex flex-col items-center justify-center rounded-lg border bg-background p-3 w-full'>
			<div className='flex w-full items-center justify-start gap-x-2'>
				<div className='h-6 w-6 shrink-0 rounded-full border border-border/15 bg-[#FE9300] ' />
				<span className='select-none text-sm font-medium'>{title}</span>
				{/* {isLoading ? <Skeleton className='h-3 w-7' /> : <span className='select-none text-sm font-medium'>{title}</span>} */}

				<Smartphone />

				{/* <Compass /> */}
			</div>

			<span className='mt-2 select-none text-sm text-muted-foreground'>{subtitle}</span>
		</div>
	);
};

export default TeamMember;
