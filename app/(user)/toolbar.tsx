import { Button } from '@/components/ui/button';
import { getWorkers } from '@/lib/twilio/read';
import React from 'react';
import ToolbarCalls from './toolbar-calls';

type Props = {};

const Toolbar = async (props: Props) => {
	const workers = await getWorkers();

	return (
		<footer className='fixed bottom-0 right-0 left-0 flex justify-end'>
			<div className='flex items-center justify-end gap-3 px-6 py-1.5'>
				<ToolbarCalls
					workers={workers.map((worker) => {
						return { label: worker.friendlyName, value: `${worker.sid}-${worker.friendlyName}` };
					})}
				/>
			</div>
		</footer>
	);
};

export default Toolbar;
