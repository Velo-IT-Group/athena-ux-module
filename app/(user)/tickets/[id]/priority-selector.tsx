'use client';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { getPriorities } from '@/lib/manage/read';
import { Priority, ReferenceType } from '@/lib/manage/types';
import { Circle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Props = {
	priority?: ReferenceType;
};

const PrioritySelector = ({ priority }: Props) => {
	const [priorities, setPriorities] = useState<Priority[] | undefined>();
	const [selectedPriority, setSelectedPriority] = useState<Priority | undefined>(
		priority ? { ...priority, color: 'gray', defaultFlag: false, sortOrder: 1 } : undefined
	);

	useEffect(() => {
		getPriorities().then((data) => {
			setPriorities(data);
			const p = data?.find((p: Priority) => p.id === priority?.id);
			setSelectedPriority(p);
		});
	}, [priority]);

	return (
		<Combobox
			items={
				priorities?.map(({ id, name }) => {
					return { label: name, value: `${id}-${name}` };
				}) ?? []
			}
			value={`${selectedPriority?.id}-${selectedPriority?.name}`}
			setValue={(e) => {
				let id = Number(e.toString().split('-')[0]);

				setSelectedPriority(priorities?.find((p) => p.id === id));
			}}
			placeholder='Filter statuses...'
			side='left'
			align='start'
		>
			<Button
				size='sm'
				variant='ghost'
				className='flex'
			>
				<Circle
					className='mr-1.5'
					style={{ color: selectedPriority?.color.toLowerCase() }}
				/>
				<span className='text-xs text-muted-foreground'>{selectedPriority?.name}</span>
			</Button>
		</Combobox>
	);
};

export default PrioritySelector;
