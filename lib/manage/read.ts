'use server';
import { baseHeaders } from '../utils';
import { Company, ServiceTicket } from './types';

export const getCompany = async (id: number): Promise<Company> => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/company/companies/${id}`, { headers: baseHeaders });
	return await response.json();
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
