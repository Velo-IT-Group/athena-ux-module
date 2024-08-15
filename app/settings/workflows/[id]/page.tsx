import { columns } from '@/components/table-columns/target';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import LabeledInput from '@/components/ui/labeled-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import { fetchWorkflow } from '@/lib/twilio/taskrouter/helpers';
import { WorkflowConfiguration } from '@/types/twilio';
import { Trash } from 'lucide-react';
import React from 'react';

type Props = {
	params: { id: string };
};

const Page = async ({ params }: Props) => {
	const workflow = await fetchWorkflow(params.id);
	const configuration = JSON.parse(workflow.configuration) as WorkflowConfiguration;

	console.log(workflow, configuration);

	return (
		<main>
			<h1>{workflow.friendlyName}</h1>

			<form
				action=''
				className='space-y-6'
			>
				<section>
					<LabeledInput
						label='Name'
						name='friendlyName'
						defaultValue={workflow.friendlyName}
						required
					/>

					<LabeledInput
						label='SID'
						name='sid'
						defaultValue={workflow.sid}
						readOnly
						disabled
					/>

					<LabeledInput
						label='Reservation Timeout'
						name='taskReservationTimeout'
						defaultValue={workflow.taskReservationTimeout}
						description='A value for how long a Task should be reserved before going to the next matching Worker.'
					/>
				</section>

				<section>
					<LabeledInput
						label='Assignment URL'
						name='assignmentCallbackUrl'
						defaultValue={workflow.assignmentCallbackUrl}
					/>

					<LabeledInput
						label='Fallback URL'
						name='fallbackAssignmentCallbackUrl'
						defaultValue={workflow.fallbackAssignmentCallbackUrl}
						description="Fallback URL will be called if the assignment URL didn't return a 200 response. Best if handled by a separate server."
					/>
				</section>

				<section>
					<LabeledInput
						label='Default Task Queue'
						name='assignmentCallbackUrl'
					>
						<Select defaultValue={'None'}>
							<SelectTrigger>
								<SelectValue placeholder='Select a task queue...' />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value='None'>None</SelectItem>
							</SelectContent>
						</Select>
					</LabeledInput>
				</section>

				<section>
					<Accordion type='multiple'>
						{configuration.task_routing.filters.map((filter) => (
							<AccordionItem value={filter.filter_friendly_name}>
								<AccordionTrigger>
									{filter.filter_friendly_name}
									<Button
										variant='ghost'
										size='icon'
										className='ml-auto mr-1.5'
									>
										<Trash />
									</Button>
								</AccordionTrigger>

								<AccordionContent>
									<LabeledInput
										label='Friendly Name'
										name='friendlyName'
										defaultValue={filter.filter_friendly_name}
									/>

									<LabeledInput
										label='Matching Tasks'
										name='expression'
										defaultValue={filter.expression}
										required
									/>

									<DataTable
										columns={columns}
										data={filter.targets}
										count={filter.targets.length}
										hidePagination
									/>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</section>
			</form>
		</main>
	);
};

export default Page;
