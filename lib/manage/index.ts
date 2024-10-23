import { baseHeaders, generateParams } from "@/utils/manage/params"
import { QueryKey } from "@tanstack/react-query"

// Define a default query function that will receive the query key
export const defaultQueryFn = async ({ queryKey }: { queryKey: QueryKey }) => {
	const params = generateParams(queryKey[1] ?? '')
	const response = await fetch(process.env.CONNECT_WISE_URL! + queryKey[0] + params, { headers: baseHeaders})
  return await response.json()
}