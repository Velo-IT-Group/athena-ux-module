import { getSystemMembers } from '@/lib/manage/read';
import { ReferenceType, SystemMember } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import React from 'react';
import { Combobox } from './ui/combobox';
import { Button } from './ui/button';
import { CircleUser } from 'lucide-react';

type Props = {
	type: 'table' | 'combobox' | 'select';
	defaultValue?: ReferenceType;
	params?: Conditions<SystemMember>;
};

const MemberList = async ({
	type,
	defaultValue,
	params = {
		orderBy: { key: 'firstName' },
		conditions: [{ parameter: { inactiveFlag: false } }],
		pageSize: 1000,
	},
}: Props) => {
	const members = await getSystemMembers(params);
	return (
		<>
			{type === 'combobox' && (
				<Combobox
					items={
						members?.map(({ id, firstName, lastName }) => {
							return { label: `${firstName} ${lastName}`, value: `${id}-${firstName} ${lastName}` };
						}) ?? []
					}
					value={`${defaultValue?.id}-${defaultValue?.name}`}
					// setValue={async (e) => {}}
					placeholder='Filter members...'
					side='left'
					align='start'
				>
					<Button
						size='sm'
						variant='ghost'
						role='combobox'
						className='flex'
					>
						<CircleUser className='mr-1.5' />
						<span className='text-xs text-muted-foreground'>{defaultValue ? defaultValue.name : 'Assign'}</span>
					</Button>
				</Combobox>
			)}
		</>
	);
};

export default MemberList;
