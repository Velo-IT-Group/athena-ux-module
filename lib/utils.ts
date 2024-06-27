import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const baseHeaders = new Headers();
baseHeaders.set('clientId', process.env.CW_CLIENT_ID!);
baseHeaders.set('Authorization', 'Basic ' + btoa(process.env.CW_USERNAME! + ':' + process.env.CW_PASSWORD!));
baseHeaders.set('Content-Type', 'application/json');
