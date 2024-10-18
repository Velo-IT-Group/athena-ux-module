'use client'; // Error components must be Client Components

import { CircleX } from 'lucide-react';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<div className='text-red-500 grid h-full w-full place-items-center'>
			<div>
				<CircleX />
				<h2>Something went wrong!</h2>
			</div>
		</div>
	);
}
