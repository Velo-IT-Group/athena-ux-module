import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { listWorkflows } from '@/lib/twilio/taskrouter/helpers';
import Link from 'next/link';
import React from 'react';

type Props = {};

const Page = async (props: Props) => {
	const workflows = await listWorkflows();

	return (
		<main>
			<header>
				<h1>Workflows</h1>
			</header>

			<section className='grid grid-cols-2 gap-3'>
				{workflows.map((workflow) => (
					<Card key={workflow.sid}>
						<CardHeader>
							<CardTitle>
								<Link href={`/settings/workflows/${workflow.sid}`}>{workflow.friendlyName}</Link>
							</CardTitle>
							<CardDescription>{workflow.sid}</CardDescription>
						</CardHeader>

						<CardContent>
							<div>
								<Label>Reservation Timeout</Label>
								<span>{workflow.taskReservationTimeout}</span>
							</div>
						</CardContent>
					</Card>
				))}
			</section>
		</main>
	);
};

export default Page;
