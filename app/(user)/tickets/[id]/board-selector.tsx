'use client';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { getBoards } from '@/lib/manage/read';
import { updateTicket } from '@/lib/manage/update';
import { ReferenceType } from '@/types/manage';
import { Box } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Props = {
	ticketId: number;
	board?: ReferenceType;
};

const BoardSelector = ({ ticketId, board }: Props) => {
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
			// setValue={async (e) => {
			// 	const id = e.toString().split('-')[0];
			// 	setSelectedBoard(boards.find((b) => b.id === Number(id)));
			// 	if (!board) return;
			// 	try {
			// 		await updateTicket(ticketId, [{ op: 'replace', path: 'board/id', value: Number(id) }]);
			// 	} catch (error) {
			// 		toast.error(error as string);
			// 	}
			// }}
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
