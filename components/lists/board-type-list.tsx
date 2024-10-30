import { getBoardTypes } from '@/lib/manage/read';
import { BoardType, ReferenceType } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import React from 'react';
import { Combobox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { CircleDashed } from 'lucide-react';
import { Kbd } from '../linear-combobox/kbd';

type Props = {
	ticketId: number;
	boardId: number;
	type: 'table' | 'combobox' | 'select';
	defaultValue?: ReferenceType;
	params?: Conditions<BoardType>;
};

const BoardTypeList = async ({ ticketId, type, boardId, defaultValue, params }: Props) => {
	const types = await getBoardTypes(boardId, params);

	return (
		<>
			{type === 'combobox' && (
				<Combobox
					id={ticketId}
					path='board/id'
					type='ticket'
					hotkey='t'
					items={types.map((type) => {
						return { label: type?.name, value: `${type?.id}-${type?.name}` };
					})}
					side='left'
					align='start'
					placeholder='Select a type...'
					value={`${defaultValue?.id}-${defaultValue?.name}`}
					// setValue={()
				>
					<div className='flex items-center justify-between'>
						<Button
							size='sm'
							variant='ghost'
							role='combobox'
							className='flex'
						>
							<CircleDashed className='mr-1.5' />
							<span className='text-xs text-muted-foreground'>{defaultValue ? defaultValue.name : 'Add type'}</span>
						</Button>

						<Kbd letter='t' />
					</div>
				</Combobox>
			)}
		</>
	);
};

export default BoardTypeList;
