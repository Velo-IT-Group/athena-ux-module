'use client';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { getSystemMembers } from '@/lib/manage/read';
import { ReferenceType, SystemMember } from '@/types/manage';
import { CircleUser } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Props = {
	member?: ReferenceType;
};

const MemberSelector = ({ member }: Props) => {
	console.log(member);
	const [members, setMembers] = useState<SystemMember[]>([]);
	const [selectedMember, setSelectedMember] = useState<SystemMember | undefined>();

	useEffect(() => {
		getSystemMembers().then((data) => {
			setMembers(data);
			setSelectedMember(data.find((d) => d.id === member?.id));
		});
	}, []);

	return (
		<Combobox
			items={members.map((member) => {
				return {
					label: `${member.firstName} ${member.lastName ?? ''}`,
					value: `${member.id}-${member.firstName} ${member.lastName ?? ''}`,
				};
			})}
			side='left'
			align='start'
			placeholder='Select a member...'
			value={`${selectedMember?.id}-${selectedMember?.firstName} ${selectedMember?.lastName ?? ''}`}
			setValue={(e) => {
				let id = Number(e.toString().split('-')[0]);
				let firstName = e.toString().split('-')[1].split(' ')[0];
				let lastName = e.toString().split('-')[1].split(' ')[1];

				setSelectedMember({ id, firstName, lastName, identifier: '' });
			}}
		>
			<Button
				size='sm'
				variant='ghost'
				className='flex'
			>
				<CircleUser className='mr-1.5' />
				<span className='text-xs text-muted-foreground'>
					{selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : 'Assign'}
				</span>
			</Button>
		</Combobox>
	);
};

export default MemberSelector;
