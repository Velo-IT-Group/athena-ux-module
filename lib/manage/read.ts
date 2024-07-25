'use server';
import { error } from 'console';
import { baseHeaders } from '../utils';
import { AuditTrailEntry, Company, Contact, Document, Note, ServiceTicket, SystemMember } from './types';

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

export const getContacts = async (id: number): Promise<Contact[]> => {
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
			`${process.env.NEXT_PUBLIC_CW_URL}/company/configurations?conditions=contact/id=10&orderBy=name,site/id`,
			{
				headers: baseHeaders,
			}
		);

		if (response.status !== 200) throw Error('Could not fetch configurations...');

		return await response.json();
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const getCompanies = async (): Promise<Company[]> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/company/companies?conditions=status/id=1&childConditions=types/id = 1&orderBy=name&pageSize=1000`,
		{ headers: baseHeaders, method: 'GET' }
	);

	if (!response.ok) {
		console.error(response.statusText);
	}

	return await response.json();
};

export const getTickets = async (id: number): Promise<ServiceTicket[]> => {
	const headers = new Headers(baseHeaders);
	headers.set('Authorization', 'Basic ' + btoa('velo+X32LB4Xx5GW5MFNz:XcwrfwGpCODhSpvD'));
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/service/tickets?conditions=company/id = ${id} and status/id in (615, 995)`,
		{
			headers: baseHeaders,
		}
	);
	return await response.json();
};

export const getTicket = async (id: number): Promise<ServiceTicket> => {
	const headers = new Headers(baseHeaders);
	headers.set('Authorization', 'Basic ' + btoa('velo+X32LB4Xx5GW5MFNz:XcwrfwGpCODhSpvD'));
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/service/tickets/${id}`, {
		headers: baseHeaders,
	});
	return await response.json();
};

export const getTicketNotes = async (id: number): Promise<Note[]> => {
	const headers = new Headers(baseHeaders);
	headers.set('Authorization', 'Basic ' + btoa('velo+X32LB4Xx5GW5MFNz:XcwrfwGpCODhSpvD'));
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/service/tickets/${id}/allNotes?orderBy=dateEntered desc`,
		{
			headers: baseHeaders,
		}
	);
	return await response.json();
};

export const getSystemMembers = async (): Promise<SystemMember[]> => {
	const headers = new Headers(baseHeaders);
	headers.set('Authorization', 'Basic ' + btoa('velo+X32LB4Xx5GW5MFNz:XcwrfwGpCODhSpvD'));
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/system/members?orderBy=firstName,lastName&conditions=inactiveFlag = false&pageSize=1000`,
		{
			headers: baseHeaders,
		}
	);

	const data = await response.json();

	return data;
};

export const getStatuses = async (id: number) => {
	// const headers = new Headers(baseHeaders);
	// headers.set('Authorization', 'Basic ' + btoa('velo+X32LB4Xx5GW5MFNz:XcwrfwGpCODhSpvD'));
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/service/boards/${id}/statuses?orderBy=name`, {
		headers: baseHeaders,
	});

	if (!response.ok) {
		console.error(response.statusText);
		throw Error('Error fetching service board statuses...', { cause: response.statusText });
	}

	return await response.json();
};

export const getPriorities = async () => {
	const headers = new Headers(baseHeaders);
	headers.set('Authorization', 'Basic ' + btoa('velo+X32LB4Xx5GW5MFNz:XcwrfwGpCODhSpvD'));
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/service/priorities?orderBy=sortOrder`, {
		headers: baseHeaders,
	});

	if (!response.ok) {
		throw Error('Error fetching priorities...', { cause: response.statusText });
	}

	return await response.json();
};

export const getBoards = async () => {
	const headers = new Headers(baseHeaders);
	headers.set('Authorization', 'Basic ' + btoa('velo+X32LB4Xx5GW5MFNz:XcwrfwGpCODhSpvD'));
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/service/boards?orderBy=name&pageSize=1000`, {
		headers: baseHeaders,
	});

	if (!response.ok) {
		throw Error('Error fetching boards...', { cause: response.statusText });
	}

	return await response.json();
};

export const getProjectStatuses = async (id: number) => {
	const headers = new Headers(baseHeaders);
	headers.set('Authorization', 'Basic ' + btoa('velo+X32LB4Xx5GW5MFNz:XcwrfwGpCODhSpvD'));
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/service/boards/${id}/statuses?orderBy=name`, {
		headers: baseHeaders,
	});

	if (!response.ok) {
		throw Error('Error fetching project statuses...', { cause: response.statusText });
	}

	return await response.json();
};

export const getTriageTickets = async (): Promise<ServiceTicket[]> => {
	const headers = new Headers(baseHeaders);
	headers.set('Authorization', 'Basic ' + btoa('velo+X32LB4Xx5GW5MFNz:XcwrfwGpCODhSpvD'));
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/service/tickets?pageSize=1000&conditions=board/id = 30 and closedFlag = false`,
		{
			headers: baseHeaders,
		}
	);

	if (!response.ok) throw Error('Error fetching triage tickets...');

	return await response.json();
};

export const getUserTickets = async (id: number): Promise<ServiceTicket[]> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/service/tickets?conditions=contact/id = 10 and status/id in (846, 662, 848, 571, 560, 645)`,
		{
			headers: baseHeaders,
		}
	);

	if (!response.ok) throw Error('Error fetching user tickets...');

	return await response.json();
};

export const getAuditTrail = async (id: number): Promise<AuditTrailEntry[]> => {
	const headers = new Headers(baseHeaders);
	headers.set('Authorization', 'Basic ' + btoa('velo+X32LB4Xx5GW5MFNz:XcwrfwGpCODhSpvD'));
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/system/audittrail?type=Ticket&id=${id}`, {
		headers,
	});

	if (!response.ok) throw Error('Error fetchnig audit trail...');

	return await response.json();
};

export const getDocuments = async (id: number): Promise<Document[]> => {
	const headers = new Headers(baseHeaders);
	headers.set('Authorization', 'Basic ' + btoa('velo+rKqwnh9Ijh16pki6:Ogvza13eeEVUA1gS'));
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/system/documents?recordType=Ticket&recordId=${id}`, {
		headers,
	});

	if (!response.ok) throw Error('Error fetching documents...');

	return await response.json();
};
