import { getBoardSubTypes } from '@/lib/manage/read';
import { BoardSubType, ReferenceType } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import React from 'react';
import { Combobox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { CircleDashed } from 'lucide-react';

type Props = {
	ticketId: number;
	boardId: number;
	type: 'table' | 'combobox' | 'select';
	defaultValue?: ReferenceType;
	params?: Conditions<BoardSubType>;
};

const BoardSubTypeList = async ({ ticketId, type, boardId, defaultValue, params }: Props) => {
	const subTypes = await getBoardSubTypes(boardId, params);

	return (
		<>
			{type === 'combobox' && (
				<Combobox
					id={ticketId}
					path='subType/id'
					type='ticket'
					items={subTypes.map((type) => {
						return { label: type?.name, value: `${type?.id}-${type?.name}` };
					})}
					side='left'
					align='start'
					placeholder='Select a sub type...'
					value={`${defaultValue?.id}-${defaultValue?.name}`}
					// setValue={()
				>
					<Button
						size='sm'
						variant='ghost'
						role='combobox'
						className='flex'
					>
						<CircleDashed className='mr-1.5' />
						<span className='text-xs text-muted-foreground'>{defaultValue ? defaultValue.name : 'Add sub type'}</span>
					</Button>
				</Combobox>
			)}
		</>
	);
};

export default BoardSubTypeList;
