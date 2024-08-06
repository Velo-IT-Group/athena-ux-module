import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
	revalidatePath('/');

	return Response.json({
		message: 'Revalidation successful',
		status: 200,
	});
}
