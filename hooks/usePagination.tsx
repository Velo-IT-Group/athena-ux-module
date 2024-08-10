import { useState } from 'react';
import { PaginationState } from '@tanstack/react-table';

type Props = {
	pageSize: 10;
	pageIndex: 0;
};

export function usePagination(props?: PaginationState) {
	const [pagination, setPagination] = useState({
		pageSize: 10,
		pageIndex: 0,
	});
	const { pageSize, pageIndex } = pagination;

	return {
		limit: pageSize,
		onPaginationChange: setPagination,
		pagination,
		skip: pageSize * pageIndex,
	};
}
