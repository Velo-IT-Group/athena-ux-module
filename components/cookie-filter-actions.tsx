'use server';

import { TableDefinition } from '@/types';
import { Conditions } from '@/utils/manage/params';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const updateFilterCookie = async <T,>(defintion: TableDefinition, params: Conditions<T>) => {
	const cookieStore = await cookies();

	const { page, section } = defintion;

	const cookieArg = `filter-${page.toLowerCase()}${section ? `-${section.toLowerCase()}` : ''}`;

	console.log(params);

	cookieStore.set(cookieArg, JSON.stringify(params));

	// revalidatePath('/');
};
