import React from 'react';
import { Button } from './ui/button';
import { ListFilter, SlidersHorizontal } from 'lucide-react';

type Props = {
	filters: {
		label: string;
		value: string | number;
		icon?: React.ComponentType<{ className?: string }>;
	}[];
};

const FilterHeader = ({ filters }: Props) => {
	return (
		<header className='flex items-center justify-between gap-3 h-9 px-3 border-b'>
			<Button
				size='sm'
				variant='ghost'
				className='space-x-1.5 h-6'
			>
				<ListFilter />
				<span className='text-xs'>Filter</span>
			</Button>

			<Button
				size='sm'
				variant='outline'
				className='space-x-1.5 h-6'
			>
				<SlidersHorizontal />
				<span className='text-xs'>Display</span>
			</Button>
		</header>
	);
};

export default FilterHeader;
