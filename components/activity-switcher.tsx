'use client';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import { useTwilio } from '@/providers/twilio-provider';
import { Combobox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';

type Props = {
	className?: string;
};

const ActivitySwitcher = ({ className }: Props) => {
	const { worker, activities } = useTwilio();
	const [selectedAccount, setSelectedAccount] = useState<string>(worker?.activity?.name ?? '');
	const selectedActivity = activities.find((account) => account.sid === selectedAccount.split('-')[0]);

	useEffect(() => {
		worker?.on('activityUpdated', (a) => {
			setSelectedAccount(a.activity.name);
		});

		return () => {
			worker?.removeListener('activityUpdated', (a) => {
				setSelectedAccount(a.activity.name);
			});
		};
	}, [worker]);

	return (
		<Combobox
			placeholder='Filter activities...'
			items={activities.map((a) => {
				return { label: a.name, value: `${a.sid}-${a.name}` };
			})}
			value={selectedAccount}
			setValue={async (e) => {
				try {
					const sid = e.toString().split('-')[0];
					const act = worker?.activities.get(sid);
					const activity = await act?.setAsCurrent();
					if (!activity) throw Error('No activity provided...');
					setSelectedAccount(activity.sid);
				} catch (error) {
					console.error(error);
					return;
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
