import { getBoards } from '@/lib/manage/read';
import { Board, ReferenceType } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import React from 'react';
import { Combobox } from '../ui/combobox';
import { Button } from '../ui/button';
import { Box } from 'lucide-react';

type Props = {
	type: 'table' | 'combobox' | 'select';
	defaultValue?: ReferenceType;
	params?: Conditions<Board>;
};

const BoardList = async ({ type, defaultValue, params = { orderBy: { key: 'name' }, pageSize: 1000 } }: Props) => {
	const boards = await getBoards(params);

	return (
		<>
			{type === 'combobox' && (
				<Combobox
					items={boards.map((board) => {
						return { label: board?.name, value: `${board?.id}-${board?.name}` };
					})}
					side='left'
					align='start'
					placeholder='Select a board...'
					value={`${defaultValue?.id}-${defaultValue?.name}`}
					setValue={() => {}}
				>
					<Button
						size='sm'
						variant='ghost'
						role='combobox'
						className='flex'
					>
						<Box className='mr-1.5' />
						<span className='text-xs text-muted-foreground'>{defaultValue ? defaultValue.name : 'Add board'}</span>
					</Button>
				</Combobox>
			)}
		</>
	);
};

export default BoardList;
