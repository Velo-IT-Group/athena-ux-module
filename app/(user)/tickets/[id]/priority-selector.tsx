'use client';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { getPriorities } from '@/lib/manage/read';
import { updateTicket } from '@/lib/manage/update';
import { Priority, ReferenceType } from '@/types/manage';
import { Circle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Props = {
	ticketId: number;
	priority?: ReferenceType;
};

const PrioritySelector = ({ ticketId, priority }: Props) => {
	const [priorities, setPriorities] = useState<Priority[] | undefined>();
	const [selectedPriority, setSelectedPriority] = useState<Priority | undefined>(
		priority ? { ...(priority as Priority), color: 'gray', defaultFlag: false, sortOrder: 1 } : undefined
	);

	useEffect(() => {
		getPriorities({ orderBy: { key: 'sortOrder' } }).then((data) => {
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
			setValue={async (e) => {
				let id = Number(e.toString().split('-')[0]);

				setSelectedPriority(priorities?.find((p) => p.id === id));
				if (!priority) return;
				try {
					await updateTicket(ticketId, [{ op: 'replace', path: 'priority/id', value: Number(id) }]);
				} catch (error) {
					toast.error(error as string);
				}
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
