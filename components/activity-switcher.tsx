'use client';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import { useTwilio } from '@/providers/twilio-provider';
import { updateWorker } from '@/lib/twilio/update';
import { Combobox } from './ui/combobox';
import { Button } from './ui/button';

type Props = {
	// activites: ActivityInstance[];
};

const ActivitySwitcher = ({}: Props) => {
	const { worker, activities } = useTwilio();
	const [selectedAccount, setSelectedAccount] = useState<string>(worker?.activitySid ?? '');
	const selectedActivity = activities.find((account) => account.name === selectedAccount);

	useEffect(() => {
		if (!selectedAccount || !worker) return;

		updateWorker(worker.sid, { activitySid: selectedActivity?.sid });
	}, [selectedAccount, selectedActivity, worker]);

	return (
		<Combobox
			placeholder='Filter activities...'
			items={activities.map((a) => {
				return { label: a.name, value: a.name };
			})}
			value={selectedAccount}
			setValue={setSelectedAccount}
		>
			<Button
				variant='outline'
				size='sm'
				className='flex items-center gap-1.5'
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
