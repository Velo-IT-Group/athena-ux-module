import React from 'react';
import { TableBody, TableCell, TableRow } from '../table';
import { Skeleton } from '../skeleton';

type Props = {
	columns: number;
	rows: number;
};

const TableSkeleton = ({ columns, rows }: Props) => {
	let blankColumns = new Array(columns).fill(null);
	let blankRows = new Array(rows).fill(null);

	return (
		<TableBody className='overflow-x-auto'>
			{blankRows.map((_, index) => (
				<TableRow key={index}>
					{blankColumns.map((_, index) => (
						<TableCell key={index}>{<Skeleton className='h-5 w-full' />}</TableCell>
					))}
				</TableRow>
			))}
		</TableBody>
	);
};

export default TableSkeleton;
