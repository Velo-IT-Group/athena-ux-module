import { updateFilterCookie } from '@/components/cookie-filter-actions';
import { TableDefinition } from '@/types';
import { Conditions } from '@/utils/manage/params';
import { useEffect, useState } from 'react';

export function usePagination<T>(definition: TableDefinition, params: Conditions<T>) {
	const [pagination, setPagination] = useState({
		pageSize: params.pageSize ?? 20,
		pageIndex: params.page ?? 1,
	});

	const { pageSize, pageIndex } = pagination;

	return {
		limit: pageSize,
		onPaginationChange: setPagination,
		pagination,
		skip: pageSize * pageIndex,
	};
}
