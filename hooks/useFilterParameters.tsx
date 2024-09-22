import { Comparison, Conditions } from '@/utils/manage/params';
import { useState } from 'react';
import { usePagination } from './usePagination';

export function useFilterParameters<T>(params?: Conditions<T>) {
	const [parameters, setParameters] = useState<Conditions<T>>(params ?? {});
	const [conditions, setConditions] = useState<Comparison[]>([]);
	const [childConditions, setChildConditions] = useState<Comparison[]>([]);
	const [orderBy, setOrderBy] = useState<{
		key: keyof T;
		order?: 'asc' | 'desc';
	}>();
	const [fields, setFields] = useState<Array<keyof T>>([]);
	const [pagination, setPagination] = useState({
		pageSize: params?.pageSize ?? 20,
		pageIndex: params?.page ?? 1,
	});

	return {
		parameters,
		onParametersChange: setParameters,
		pagination,
		onPaginationChange: setPagination,
	};
}
