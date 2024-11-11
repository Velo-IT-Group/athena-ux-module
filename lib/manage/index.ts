import { baseHeaders, generateParams } from "@/utils/manage/params"
import { QueryKey } from "@tanstack/react-query"
import { userHeaders } from '@/lib/utils';

// Define a default query function that will receive the query key
export const defaultQueryFn = async ({ queryKey }: { queryKey: QueryKey }) => {
	const params = generateParams(queryKey[1] ?? '')
	const response = await fetch(`${process.env.CONNECT_WISE_URL!}${queryKey[0]}/${params}`, { headers: baseHeaders})
  return await response.json()
}


// Define a default query function that will receive the query key
// export const defaultMutationFn = async ({ queryKey }: { queryKey: QueryKey }) => {
export const defaultMutationFn = async (variables: any) => {
	const method = variables.method ?? 'PATCH'
	const body = variables.data ? JSON.stringify(variables.data) : undefined
	
	return fetch(`${process.env.CONNECT_WISE_URL!}${variables.path}`, {
		headers: userHeaders,
		method,
		body
	})
}