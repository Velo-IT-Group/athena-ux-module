import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const baseHeaders = new Headers();
baseHeaders.set('clientId', process.env.CONNECT_WISE_CLIENT_ID!);
baseHeaders.set(
	'Authorization',
	'Basic ' + btoa(process.env.CONNECT_WISE_USERNAME! + ':' + process.env.CONNECT_WISE_PASSWORD!)
);
baseHeaders.set('Content-Type', 'application/json');

export const userHeaders = new Headers();
userHeaders.set('clientId', process.env.CONNECT_WISE_CLIENT_ID!);
userHeaders.set('Content-Type', 'application/json');

import parser, { CountryCode, NumberFormat, FormatNumberOptions } from 'libphonenumber-js';

export const parsePhoneNumber = (
	text: string,
	country: CountryCode = 'US',
	format: NumberFormat = 'NATIONAL',
	formatOptions?: FormatNumberOptions
) => {
	const number = parser(text, country);
	return {
		isValid: number ? number.isValid() : false,
		formattedNumber: number?.format(format, formatOptions),
		options: number,
	};
};

/**
 * Checks if the given value is valid as phone number
 * @param {Number|String} number
 * @return {Boolean}
 */
export const isAValidPhoneNumber = (phoneNumber: string) => {
	return /^[\d\+\-\(\) ]+$/.test(phoneNumber);
};
