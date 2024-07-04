'use server';
import { baseHeaders } from '../utils';
import { Company, Contact, ServiceTicket } from './types';

export const getCompany = async (id: number): Promise<Company> => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/company/companies/${id}`, { headers: baseHeaders });
	return await response.json();
};

export const getContact = async (id?: number): Promise<Contact | undefined> => {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/company/contacts/${id}`, { headers: baseHeaders });

		if (response.status !== 200) throw Error('Could not find contact...');

		return await response.json();
	} catch (error) {
		console.error(error);
	}
};

export const getContacts = async (id?: number): Promise<Contact[]> => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_CW_URL}/company/contacts/?conditions=company/id = ${id}&pageSize=1000&orderBy=firstName, lastName`,
			{
				headers: baseHeaders,
			}
		);

		if (response.status !== 200) throw Error('Could not fetch contacts...');

		return await response.json();
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const getConfigurations = async (id?: number): Promise<Contact[]> => {
	const headers: HeadersInit = baseHeaders;
	headers.set('Authorization', 'Basic ' + btoa('velo+cyTkw7WgbwL55BE1:LkQxsnjZ3fEnyNEr'));

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_CW_URL}/company/configurations?conditions=contact/id=${id}&orderBy=name,site/id`,
			{
				headers,
			}
		);

		if (response.status !== 200) throw Error('Could not fetch contacts...');

		return await response.json();
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const getCompanies = async (): Promise<Company[]> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/company/companies?conditions=status/id=1&orderBy=name&pageSize=500`,
		{ headers: baseHeaders }
	);
	return await response.json();
};

export const getTickets = async (id: number): Promise<ServiceTicket[]> => {
	const headers = new Headers(baseHeaders);
	headers.set('Authorization', 'Basic ' + btoa('velo+X32LB4Xx5GW5MFNz:XcwrfwGpCODhSpvD'));
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/service/tickets?conditions=company/id = ${id} and status/id in (615, 995)`,
		{
			headers,
		}
	);
	return await response.json();
};

export const getUserTickets = async (id: number): Promise<ServiceTicket[]> => {
	const headers = new Headers(baseHeaders);
	headers.set('Authorization', 'Basic ' + btoa('velo+X32LB4Xx5GW5MFNz:XcwrfwGpCODhSpvD'));
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/service/tickets?conditions=contact/id = ${id} and status/id in (846, 662, 848, 571, 560, 645)`,
		{
			headers,
		}
	);
	return await response.json();
};
