import { DataTable } from '@/components/ui/data-table';
import { listQueues } from '@/lib/twilio/taskrouter/helpers';
import React from 'react';
import { columns } from './columns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

type Props = {};

const Page = async (props: Props) => {
	const queues = await listQueues();

	console.log(JSON.stringify(queues));
	return (
		<main>
			<header>
				<h1>Queues</h1>
			</header>

			<section>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>SID</TableHead>
							<TableHead>Maximum reserved Workers</TableHead>
							<TableHead>Target Worker expression</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{queues.map((queue) => (
							<TableRow key={queue.sid}>
								<TableCell>
									<Link href={`/settings/queues/${queue.sid}`}>{queue.friendlyName}</Link>
								</TableCell>
								<TableCell>{queue.sid}</TableCell>
								<TableCell>{queue.maxReservedWorkers}</TableCell>
								<TableCell>{queue.targetWorkers}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</section>
		</main>
	);
};

export default Page;
