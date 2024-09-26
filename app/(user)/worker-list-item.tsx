import { Button } from '@/components/ui/button';
import { CommandItem } from '@/components/ui/command';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { parsePhoneNumber } from '@/lib/utils';
import { SystemMember } from '@/types/manage';
import { Building, Phone, PhoneForwarded, Smartphone } from 'lucide-react';
import React, { Dispatch, SetStateAction, useState } from 'react';

type Props = {
	member: SystemMember;
	actionFn: ((isWorker: boolean, id: string | number) => void) | undefined;
	onOpenChange: Dispatch<SetStateAction<boolean>>;
};

const WorkerListItem = ({ member, actionFn, onOpenChange }: Props) => {
	const [open, setOpen] = useState(false);

	function hasMultipleNumbers() {
		const phoneKeys = ['homePhone', 'mobilePhone', 'officePhone'];

		let valueCount = 0;

		for (const key of phoneKeys) {
			// @ts-ignore
			if (member[key]) {
				valueCount++;
			}

			if (valueCount > 1) {
				return true;
			}
		}

		return false;
	}

	return (
		<CommandItem
			value={`${member.officePhone ?? member.mobilePhone ?? member.officePhone}-${member.firstName} ${
				member.lastName ?? ''
			}`}
			onSelect={(currentValue) => {
				if (!hasMultipleNumbers()) {
					const id = currentValue.split('-')[0];
					actionFn?.(false, id);
					onOpenChange(false);
					return;
				}

				setOpen(true);
			}}
			className='flex items-center justify-between gap-3'
		>
			<span>
				{member.firstName} {member.lastName ?? ''}
			</span>

			{hasMultipleNumbers() ? (
				<DropdownMenu
					open={open}
					onOpenChange={setOpen}
				>
					<DropdownMenuTrigger asChild>
						<Button
							size='smIcon'
							variant='ghost'
						>
							<PhoneForwarded />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						side='right'
						align='start'
					>
						{member.homePhone && (
							<DropdownMenuItem
								defaultChecked={member.defaultPhone === 'Home'}
								onSelect={() => {
									actionFn?.(false, member.homePhone!);
									onOpenChange(false);
									return;
								}}
							>
								<Phone className='mr-1.5' /> {parsePhoneNumber(member.homePhone).formattedNumber}
							</DropdownMenuItem>
						)}

						{member.mobilePhone && (
							<DropdownMenuItem
								defaultChecked={member.defaultPhone === 'Mobile'}
								onSelect={() => {
									actionFn?.(false, member.mobilePhone!);
									onOpenChange(false);
									return;
								}}
							>
								<Smartphone className='mr-1.5' /> {parsePhoneNumber(member.mobilePhone).formattedNumber}
							</DropdownMenuItem>
						)}

						{member.officePhone && (
							<DropdownMenuItem
								defaultChecked={member.defaultPhone === 'Office'}
								onSelect={() => {
									actionFn?.(false, member.officePhone!);
									onOpenChange(false);
									return;
								}}
							>
								<Building className='mr-1.5' /> {parsePhoneNumber(member.officePhone).formattedNumber}
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<Button
					size='smIcon'
					variant='ghost'
				>
					<PhoneForwarded />
				</Button>
			)}
		</CommandItem>
	);
};

export default WorkerListItem;
