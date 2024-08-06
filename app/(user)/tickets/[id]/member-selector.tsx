'use client';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { getSystemMembers } from '@/lib/manage/read';
import { updateTicket } from '@/lib/manage/update';
import { ReferenceType, SystemMember } from '@/types/manage';
import { CircleUser } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Props = {
	ticketId: number;
	member?: ReferenceType;
};

const MemberSelector = ({ ticketId, member }: Props) => {
	const [members, setMembers] = useState<SystemMember[]>([]);
	const [selectedMember, setSelectedMember] = useState<SystemMember | undefined>();

	useEffect(() => {
		getSystemMembers({ orderBy: { key: 'firstName' }, conditions: [{ inactiveFlag: false }], pageSize: 1000 }).then(
			(data) => {
				setMembers(data);
				setSelectedMember(data.find((d) => d.id === member?.id));
			}
		);
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
			setValue={async (e) => {
				let id = Number(e.toString().split('-')[0]);
				let firstName = e.toString().split('-')[1].split(' ')[0];
				let lastName = e.toString().split('-')[1].split(' ')[1];

				setSelectedMember({ id, firstName, lastName, identifier: '' });
				try {
					toast.info(id);
					await updateTicket(ticketId, [{ op: 'replace', path: 'owner/id', value: id }]);
				} catch (error) {
					toast.error(JSON.stringify(error) as string);
				}
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
