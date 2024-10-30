import { getStatuses } from '@/lib/manage/read';
import { BoardStatus, ReferenceType } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import React from 'react';
import { Combobox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { CircleDashed } from 'lucide-react';
import { Kbd } from '../linear-combobox/kbd';

type Props = {
	type: 'table' | 'combobox' | 'select';
	id: number;
	defaultValue?: ReferenceType;
	params?: Conditions<BoardStatus>;
};

const BoardStatusList = async ({ type, id, defaultValue, params }: Props) => {
	console.log(id);
	const statuses = await getStatuses(id, params);

	return (
		<>
			{type === 'combobox' && (
				// @ts-ignore
				<Combobox
					hotkey='s'
					items={statuses.map((status) => {
						return { label: status?.name, value: `${status?.id}-${status?.name}` };
					})}
					side='left'
					align='start'
					placeholder='Select a status...'
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
							<span className='text-xs text-muted-foreground'>{defaultValue ? defaultValue.name : 'Add status'}</span>
						</Button>

						<Kbd letter='s' />
					</div>
				</Combobox>
			)}
		</>
	);
};

export default BoardStatusList;
