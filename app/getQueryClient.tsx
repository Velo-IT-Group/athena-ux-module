// app/getQueryClient.jsx
import { defaultMutationFn, defaultQueryFn } from '@/lib/manage';
import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

// cache() is scoped per request, so we don't leak data between requests
const getQueryClient = cache(
	() =>
		new QueryClient({
			defaultOptions: {
				queries: {
					queryFn: defaultQueryFn,
				},
				mutations: {
					mutationFn: defaultMutationFn,
				},
			},
		})
);

export default getQueryClient;
