'use client';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { getBoards } from '@/lib/manage/read';
import { ReferenceType } from '@/types/manage';
import { Box } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Props = {
	board?: ReferenceType;
};

const BoardSelector = ({ board }: Props) => {
	const [boards, setBoards] = useState<ReferenceType[]>([]);
	const [selectedBoard, setSelectedBoard] = useState<ReferenceType>();

	useEffect(() => {
		getBoards({ orderBy: { key: 'name' }, pageSize: 1000 }).then((data) => {
			setBoards(data);
			setSelectedBoard(data.find((d: ReferenceType) => d.id === board?.id));
		});
	}, []);

	return (
		<Combobox
			items={boards.map((board) => {
				return { label: board?.name, value: `${board?.id}-${board?.name}` };
			})}
			side='left'
			align='start'
			placeholder='Select a board...'
			value={`${selectedBoard?.id}-${selectedBoard?.name}`}
			setValue={(e) => {
				const id = e.toString().split('-')[0];
				setSelectedBoard(boards.find((b) => b.id === Number(id)));
			}}
		>
			<Button
				size='sm'
				variant='ghost'
				className='flex'
			>
				<Box className='mr-1.5' />
				<span className='text-xs text-muted-foreground'>{selectedBoard ? selectedBoard.name : 'Add board'}</span>
			</Button>
		</Combobox>
	);
};

export default BoardSelector;
