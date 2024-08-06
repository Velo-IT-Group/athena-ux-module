import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import LabeledInput from '@/components/ui/labeled-input';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { getFlow, listFlowExecutions } from '@/lib/twilio/studio/read';
import { FlowState } from '@/types/twilio';
import React from 'react';

type Props = {
	params: { id: string };
};

const Page = async ({ params }: Props) => {
	const [flow, executions] = await Promise.all([getFlow(params.id), listFlowExecutions(params.id)]);
	const states = flow.definition.states as FlowState[];
	const triggerIndex = states.findIndex((state) => state.type === 'trigger');
	const [trigger] = states.splice(triggerIndex, 1);

	// console.log(states);

	const testUsers = flow.testUsers();

	return (
		<main className='grid gap-1.5'>
			<h1>{flow.friendlyName}</h1>

			<Sheet>
				<SheetTrigger>
					<Card>
						<CardHeader>
							<CardTitle>{trigger?.name}</CardTitle>
						</CardHeader>

						<CardContent className='grid grid-cols-5 gap-1.5 justify-start'>
							{trigger?.transitions.map((transition) => (
								<span
									key={transition.event}
									className='overflow-hidden'
								>
									{transition.event}
								</span>
							))}
						</CardContent>
					</Card>
				</SheetTrigger>

				<SheetContent className='flex flex-col h-full'>
					<form className='flex flex-col gap-3 h-full'>
						<LabeledInput
							defaultValue={flow.friendlyName}
							name='friendlyName'
							label='Flow name'
							required
						/>

						<LabeledInput
							name='description'
							label='Description'
							required
						>
							<Textarea
								name='description'
								defaultValue={flow.definition.description}
								minRows={2}
							/>
						</LabeledInput>

						<LabeledInput
							readOnly
							label='Webhook URL'
							disabled
							defaultValue={flow.webhookUrl}
						/>

						<LabeledInput
							readOnly
							label='REST API URL'
							disabled
							defaultValue={flow.url}
						/>

						<LabeledInput
							name='testUsers'
							label='Test Users'
							required
						>
							<Textarea
								name='testUsers'
								defaultValue={JSON.stringify(testUsers, null, 2)}
								minRows={2}
							/>
						</LabeledInput>

						<LabeledInput
							name='allow_concurrent_calls'
							label='Concurrent Calls Trigger'
							description='This feature allows concurrent inbound calls from the same phone number. This disables the Send & Wait for Reply widget if connected to the Incoming Call trigger because if the phone number is the same or unknown, messages with replies cannot be handled by the flow.\nYou should only disable this setting when you have a flow that only has callers with unique Caller IDs.'
							required
						>
							<Switch defaultChecked={flow.definition.flags.allow_concurrent_calls} />
						</LabeledInput>

						<SheetFooter className='mt-auto'>
							<SheetClose asChild>
								<Button variant='secondary'>Close</Button>
							</SheetClose>
							<Button>Save</Button>
						</SheetFooter>
					</form>
				</SheetContent>
			</Sheet>

			{states.map((state) => {
				const parsedAttributes = JSON.parse(JSON.stringify(state.properties.task_attributes));
				return (
					<Card>
						<CardHeader>
							<CardTitle>{state.name}</CardTitle>
						</CardHeader>

						{state.properties.task_attributes && (
							<CardContent>
								{/* {Object.entries(JSON.parse(parsedAttributes)).map(([key, value]) => (
									<p>
										{key}: {value}
									</p>
								))} */}
							</CardContent>
						)}
					</Card>
				);
			})}
		</main>
	);
};

export default Page;
