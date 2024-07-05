import { getWorkers } from '@/lib/twilio/read';
import { useEffect, useState } from 'react';
import { WorkerInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/worker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Props = {
	name?: string;
};

const WorkerSelect = ({ name }: Props) => {
	const [workers, setWorkers] = useState<WorkerInstance[]>([]);

	useEffect(() => {
		getWorkers().then((w) => setWorkers(w));
	}, []);

	return (
		<Select name={name}>
			<SelectTrigger>
				<SelectValue placeholder='Select a worker...' />
			</SelectTrigger>

			<SelectContent>
				{workers?.map((worker) => (
					<SelectItem
						key={worker.sid}
						value={worker.sid}
					>
						{worker.friendlyName}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default WorkerSelect;
