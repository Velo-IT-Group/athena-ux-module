'use server';
import { cookies } from 'next/headers';

export const onLayoutChange = async (sizes: number[]) => {
	const cookieStore = await cookies();
	cookieStore.set('react-resizable-panels:layout', JSON.stringify(sizes));
};
