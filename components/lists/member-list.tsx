import { getSystemMembers } from '@/lib/manage/read';
import { ReferenceType, SystemMember } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import React from 'react';
import { Combobox } from '../ui/combobox';
import { Button } from '../ui/button';
import { CircleUser } from 'lucide-react';
import { Kbd } from '../linear-combobox/kbd';

type Props = {
	id: number;
	path: string;
	type: 'table' | 'combobox' | 'select';
	defaultValue?: ReferenceType;
	params?: Conditions<SystemMember>;
};

const MemberList = async ({
	id,
	path,
	type,
	defaultValue,
	params = {
		orderBy: { key: 'firstName' },
		conditions: { inactiveFlag: false },
		pageSize: 1000,
	},
}: Props) => {
	const members = await getSystemMembers(params);

	return (
		<>
			{type === 'combobox' && (
				<Combobox
					id={id}
					path={path}
					type='ticket'
					items={
						members?.map(({ id, firstName, lastName }) => {
							return { label: `${firstName} ${lastName ?? ''}`, value: `${id}-${firstName} ${lastName ?? ''}` };
						}) ?? []
					}
					value={`${defaultValue?.id}-${defaultValue?.name}`}
					placeholder='Filter members...'
					side='left'
					align='start'
					hotkey='r'
				>
					<div className='flex items-center justify-between'>
						<Button
							size='sm'
							variant='ghost'
							role='combobox'
							className='flex'
						>
							<CircleUser className='mr-1.5' />
							<span className='text-xs text-muted-foreground'>{defaultValue ? defaultValue.name : 'Assign'}</span>
						</Button>

						<Kbd letter='r' />
					</div>
				</Combobox>
			)}
		</>
	);
};

export default MemberList;
