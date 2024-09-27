import { Comparison, Conditions } from '@/utils/manage/params';
import { useEffect, useState } from 'react';

export function useFilterParameters<T>(params?: Conditions<T>) {
	const [parameters, setParameters] = useState<Conditions<T>>(params ?? {});
	const [conditions, setConditions] = useState<Comparison[]>([]);
	const [childConditions, setChildConditions] = useState<Comparison[]>([]);
	const [orderBy, setOrderBy] = useState<{
		key: keyof T;
		order?: 'asc' | 'desc';
	}>();
	const [pagination, setPagination] = useState({
		pageSize: params?.pageSize ?? 20,
		pageIndex: params?.page ?? 1,
	});

	useEffect(() => {
		if (pagination.pageIndex === parameters.page && pagination.pageSize === parameters.pageSize) return;

		setParameters((prev) => {
			return { ...prev, page: pagination.pageIndex, pageSize: pagination.pageSize };
		});
	}, [pagination]);

	return {
		parameters,
		onParametersChange: setParameters,
		pagination,
		onPaginationChange: setPagination,
	};
}
