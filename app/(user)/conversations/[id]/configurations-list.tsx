import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';

type Props = {
	configurations: any[];
};

const ConfigurationsList = async ({ configurations }: Props) => {
	return (
		<Card>
			<CardContent className='p-3'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{configurations.map((configuration) => (
							<TableRow key={configuration.id}>
								<TableCell>{configuration.name}</TableCell>
								<TableCell>{configuration.type.name}</TableCell>
								<TableCell>{configuration.status.name}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};

export default ConfigurationsList;
