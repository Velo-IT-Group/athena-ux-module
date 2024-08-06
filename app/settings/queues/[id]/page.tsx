import LabeledInput from '@/components/ui/labeled-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getWorkers } from '@/lib/twilio/read';
import { fetchQueue, listActivities } from '@/lib/twilio/taskrouter/helpers';
import React from 'react';

type Props = {
	params: { id: string };
};

const Page = async ({ params }: Props) => {
	const [queue, activites, workers] = await Promise.all([fetchQueue(params.id), listActivities(), getWorkers()]);

	return (
		<main>
			<header>
				<h1>{queue.friendlyName}</h1>
			</header>

			<section>
				<LabeledInput
					name='name'
					label='Name'
					defaultValue={queue.friendlyName}
					required
				/>

				<LabeledInput
					name='taskOrder'
					label='Task Order'
					defaultValue={queue.taskOrder}
					required
				>
					<Select
						name='taskOrder'
						defaultValue={queue.taskOrder}
					>
						<SelectTrigger>
							<SelectValue placeholder='Select an order...' />
						</SelectTrigger>

						<SelectContent>
							<SelectItem value='FIFO'>First In, First Out</SelectItem>
							<SelectItem value='LIFO'>Last In, First Out</SelectItem>
						</SelectContent>
					</Select>
				</LabeledInput>

				<LabeledInput
					name='reservationActivitySid'
					label='Reservation Activity'
					required
				>
					<Select
						name='reservationActivitySid'
						defaultValue={queue.reservationActivitySid}
					>
						<SelectTrigger>
							<SelectValue placeholder='Select an reservation...' />
						</SelectTrigger>

						<SelectContent>
							{activites.map((activity) => (
								<SelectItem
									key={activity.sid}
									value={activity.sid}
								>
									{activity.friendlyName}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</LabeledInput>

				<LabeledInput
					name='assignmentActivitySid'
					label='Assignment Activity'
					required
				>
					<Select
						name='assignmentActivitySid'
						defaultValue={queue.assignmentActivitySid}
					>
						<SelectTrigger>
							<SelectValue placeholder='Select an reservation...' />
						</SelectTrigger>

						<SelectContent>
							{activites.map((activity) => (
								<SelectItem
									key={activity.sid}
									value={activity.sid}
								>
									{activity.friendlyName}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</LabeledInput>

				<LabeledInput
					name='maxReservedWorkers'
					label='Maximum reserved Workers'
					type='number'
					defaultValue={queue.maxReservedWorkers}
					required
				/>

				<LabeledInput
					name='targetWorkers'
					label='Target Worker expression'
					defaultValue={queue.targetWorkers}
					required
				/>
			</section>

			<section>
				{workers.map((worker) => (
					<p key={worker.sid}>{worker.friendlyName}</p>
				))}
			</section>
		</main>
	);
};

export default Page;
