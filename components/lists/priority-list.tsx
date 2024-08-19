import { getPriorities } from '@/lib/manage/read';
import { Priority, ReferenceType } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import React from 'react';
import { Combobox } from '../ui/combobox';
import { Button } from '../ui/button';
import { Circle } from 'lucide-react';

type Props = {
	ticketId: number;
	type: 'table' | 'combobox' | 'select';
	defaultValue?: ReferenceType;
	params?: Conditions<Priority>;
};

const PriorityList = async ({ ticketId, type, defaultValue, params = { orderBy: { key: 'sortOrder' } } }: Props) => {
	const priorities = await getPriorities(params);

	return (
		<>
			{type === 'combobox' && (
				<Combobox
					id={ticketId}
					path='priority/id'
					type='ticket'
					items={
						priorities?.map(({ id, name }) => {
							return { label: name, value: `${id}-${name}` };
						}) ?? []
					}
					value={`${defaultValue?.id}-${defaultValue?.name}`}
					// setValue={() => {}}
					placeholder='Filter statuses...'
					side='left'
					align='start'
				>
					<Button
						size='sm'
						variant='ghost'
						role='combobox'
						className='flex'
					>
						<Circle
							className='mr-1.5'
							// @ts-ignore
							style={{ color: defaultValue?.color?.toLowerCase() }}
						/>
						<span className='text-xs text-muted-foreground'>
							{defaultValue?.name ? defaultValue.name : 'Assign Priority'}
						</span>
					</Button>
				</Combobox>
			)}
		</>
	);
};

export default PriorityList;
