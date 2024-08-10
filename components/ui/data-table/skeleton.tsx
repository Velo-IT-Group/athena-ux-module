import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table';
import { Skeleton } from '../skeleton';

type Props = {};

const TableSkeleton = (props: Props) => {
	let blankColumns = new Array(5).fill(null);
	let blankRows = new Array(9).fill(null);

	return (
		<div className='rounded-md border'>
			<Table>
				<TableHeader>
					<TableRow>
						{blankColumns.map((_, index) => {
							return (
								<TableHead key={index}>
									<Skeleton className='h-12 w-full' />
								</TableHead>
							);
						})}
					</TableRow>
				</TableHeader>

				<TableBody className='overflow-x-auto'>
					{blankRows.map((_, index) => (
						<TableRow key={index}>
							{blankColumns.map((_, index) => (
								<TableCell key={index}>{<Skeleton className='h-12 w-full' />}</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default TableSkeleton;
