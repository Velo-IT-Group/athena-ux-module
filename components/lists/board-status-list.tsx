import { getStatuses } from '@/lib/manage/read';
import { BoardStatus, ReferenceType } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import React from 'react';
import { Combobox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { CircleDashed } from 'lucide-react';

type Props = {
	type: 'table' | 'combobox' | 'select';
	id: number;
	defaultValue?: ReferenceType;
	params?: Conditions<BoardStatus>;
};

const BoardStatusList = async ({ type, id, defaultValue, params }: Props) => {
	console.log(id);
	const statuses = await getStatuses(id, params);

	return (<>
        {type === 'combobox' && (
            // @ts-ignore
            (<Combobox
                items={statuses.map((status) => {
                    return { label: status?.name, value: `${status?.id}-${status?.name}` };
                })}
                side='left'
                align='start'
                placeholder='Select a status...'
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
                    <span className='text-xs text-muted-foreground'>{defaultValue ? defaultValue.name : 'Add status'}</span>
                </Button>
            </Combobox>)
        )}
    </>);
};

export default BoardStatusList;
