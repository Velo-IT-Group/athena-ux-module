import React from 'react';
import { KeyValue } from '@/utils/manage/params';
import { Label } from '../label';
import { Switch } from '../switch';

interface DataTableFacetedFilterProps<TData> {
	accessoryKey: keyof TData;
	title: string;
	defaultValue: boolean;
	setCondition: (condition: KeyValue) => void;
	removeCondition: (keyToRemove: string) => void;
}

const BooleanFilter = <TData,>({
	accessoryKey,
	title,
	defaultValue,
	setCondition,
	removeCondition,
}: DataTableFacetedFilterProps<TData>) => {
	return (
		<div className='flex items-center gap-1.5'>
			<Label className='text-nowrap'>{title}</Label>
			<Switch
				defaultChecked={defaultValue}
				onCheckedChange={(isChecked) => {
					if (isChecked) {
						removeCondition(accessoryKey as string);
					} else {
						setCondition({ [accessoryKey]: defaultValue });
					}
				}}
			/>
		</div>
	);
};

export default BooleanFilter;
