'use server';
import { cookies } from 'next/headers';

export const onLayoutChange = (sizes: number[]) => {
	const cookieStore = cookies();
	cookieStore.set('react-resizable-panels:layout:mail', JSON.stringify(sizes));
};
