import { PhoneOutgoing, ShieldCheck } from 'lucide-react';
import React from 'react';
import { Input } from '../ui/input';

type Props = {};

const OutboundDial = ({}: Props) => {
	return (
		<div className='bg-muted flex w-full max-w-[285px] flex-col items-center justify-center gap-y-3 rounded-xl border py-3 px-1.5'>
			<div className='flex flex-col items-center justify-center gap-2'>
				<div className='flex items-center justify-center rounded-full border bg-background p-2'>
					<PhoneOutgoing />
				</div>
				<div className='flex flex-col items-center justify-center gap-1 px-2'>
					<span className='text-base font-medium '>Make Call</span>
					<span className='w-full text-center text-sm text-muted-foreground'>
						Choose who can comment on deployments for feature/additional-design-changes.
					</span>
				</div>
			</div>
			<Input placeholder='Search contacts or type number...' />
		</div>
	);
};

export default OutboundDial;
