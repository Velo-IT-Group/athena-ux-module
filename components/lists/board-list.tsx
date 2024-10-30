import { getBoards } from '@/lib/manage/read';
import { Board, ReferenceType } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import React from 'react';
import { Combobox } from '../ui/combobox';
import { Button } from '../ui/button';
import { Box } from 'lucide-react';
import { Kbd } from '../linear-combobox/kbd';

type Props = {
	ticketId: number;
	type: 'table' | 'combobox' | 'select';
	defaultValue?: ReferenceType;
	params?: Conditions<Board>;
};

const BoardList = async ({
	ticketId,
	type,
	defaultValue,
	params = { orderBy: { key: 'name' }, pageSize: 1000 },
}: Props) => {
	const boards = await getBoards(params);

	return (
		<>
			{type === 'combobox' && (
				<Combobox
					id={ticketId}
					path='board/id'
					type='ticket'
					items={boards.map((board) => {
						return { label: board?.name, value: `${board?.id}-${board?.name}` };
					})}
					hotkey='b'
					side='left'
					align='start'
					placeholder='Select a board...'
					value={`${defaultValue?.id}-${defaultValue?.name}`}
					// setValue={() => {}}
				>
					<div className='flex items-center justify-between'>
						<Button
							size='sm'
							variant='ghost'
							role='combobox'
							className='flex'
						>
							<Box className='mr-1.5' />
							<span className='text-xs text-muted-foreground'>{defaultValue ? defaultValue.name : 'Add board'}</span>
						</Button>

						<Kbd letter='b' />
					</div>
				</Combobox>
			)}
		</>
	);
};

export default BoardList;
