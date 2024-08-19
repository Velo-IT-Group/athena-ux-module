'use client';
import { ReactNode, useEffect, useState } from 'react';
import { Combobox } from '@/components/ui/combobox';
import { getWorkers } from '@/lib/twilio/read';
import { UserPlus } from 'lucide-react';
import { WorkerInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/worker';

type Props = {
	children?: ReactNode;
};

const WorkerSelector = ({ children }: Props) => {
	const [worker, setWorker] = useState<WorkerInstance>();
	const [workers, setWorkers] = useState<WorkerInstance[]>([]);

	useEffect(() => {
		getWorkers()
			.then((w) => setWorkers(w))
			.catch((e) => console.error(e));
	}, []);

	return (
		<Combobox
			placeholder='Filter workers...'
			items={workers.map((w) => {
				return { label: w.friendlyName, value: w.friendlyName };
			})}
			// setValue={(e) => {
			// 	const w = workers.find((workContext) => workContext.friendlyName === e.toString());
			// 	setWorker(w);
			// }}
			value={worker?.friendlyName ?? ''}
			side='top'
			align='end'
		>
			{children ? children : <UserPlus className='text-muted-foreground cursor-pointer' />}
		</Combobox>
	);
};

export default WorkerSelector;
