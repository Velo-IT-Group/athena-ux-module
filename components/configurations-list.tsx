import { getConfigurations } from '@/lib/manage/read';
import { Configuration, ReferenceType } from '@/types/manage';
import { Conditions } from '@/utils/manage/params';
import React from 'react';
import { DataTable } from './ui/data-table';
import { columns } from './table-columns/configuration';

type Props = {
	type: 'table' | 'combobox' | 'select';
	defaultValue?: ReferenceType;
	params?: Conditions<Configuration>;
};

const ConfigurationsList = async ({ type, defaultValue, params }: Props) => {
	const configurations = await getConfigurations(params);
	return (
		<>
			{type === 'table' && (
				<DataTable
					data={configurations}
					columns={columns}
				/>
			)}
		</>
	);
};

export default ConfigurationsList;
