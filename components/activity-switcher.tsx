'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import { useTwilio } from '@/providers/twilio-provider';
import { updateWorker } from '@/lib/twilio/update';
import { Combobox } from './ui/combobox';
import { Button } from './ui/button';
import { useJabra } from '@/providers/jabra-provider';
import { webHidPairing } from '@gnaudio/jabra-js';

type Props = {
	className?: string;
};

const ActivitySwitcher = ({ className }: Props) => {
	const { worker, activities } = useTwilio();
	const { currentCallControl } = useJabra();
	const [selectedAccount, setSelectedAccount] = useState<string>(worker?.activity?.name ?? '');
	const selectedActivity = activities.find((account) => account.name === selectedAccount);

	return (
		<Combobox
			placeholder='Filter activities...'
			items={activities.map((a) => {
				return { label: a.name, value: a.name };
			})}
			value={selectedAccount}
			setValue={async (e) => {
				if (currentCallControl) {
					setSelectedAccount(e);
					const activity = activities.find((account) => account.name === selectedAccount);
					await updateWorker(worker!.sid, { activitySid: activity?.sid });
				} else {
					await webHidPairing();
				}
			}}
			align='end'
		>
			<Button
				variant='outline'
				size='sm'
				className={cn('flex items-center gap-1.5', className)}
			>
				<CheckCircle2
					className={cn('inline-block', selectedActivity?.available ? 'stroke-green-500' : 'stroke-red-500')}
				/>

				<span>{selectedActivity?.name || activities[0]?.name || ''}</span>
			</Button>
		</Combobox>
	);
};

export default ActivitySwitcher;
