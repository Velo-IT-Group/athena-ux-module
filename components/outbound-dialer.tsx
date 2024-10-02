'use client';
import React, { useState } from 'react';
import OutboundDialerContent from './outbound-dialer-content';
import { toast } from 'sonner';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { BellRing, FlaskConical } from 'lucide-react';
import { useDevice } from '@/providers/device-provider';

type Props = {};

const OutboundDialer = (props: Props) => {
	const [isRinging, setIsRinging] = useState(false);
	const { currentCallControl, testDevice } = useDevice();

	return (
		<div className='space-y-1.5'>
			<OutboundDialerContent numbers={[]} />

			<Separator />

			<div className='flex items-center gap-1.5'>
				<Button
					variant='outline'
					size='icon'
					className='shrink-0'
					onClick={async () => {
						try {
							currentCallControl?.ring(!isRinging);
							setIsRinging((prev) => !prev);
						} catch (error) {
							console.error(error);
							toast.error(JSON.stringify(error) as string);
						}
					}}
				>
					<BellRing />
				</Button>

				<Button
					variant='outline'
					size='icon'
					className='shrink-0'
					onClick={() => {
						testDevice();
					}}
				>
					<FlaskConical />
				</Button>
			</div>
		</div>
	);
};

export default OutboundDialer;
