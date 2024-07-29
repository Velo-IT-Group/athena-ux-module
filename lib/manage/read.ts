'use server';
import { baseHeaders } from '../utils';
import {
	AuditTrailEntry,
	Company,
	Contact,
	Document,
	Holiday,
	Note,
	RecordType,
	Schedule,
	ServiceTicket,
	SystemMember,
} from './types';

export const getCompany = async (id: number): Promise<Company> => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/company/companies/${id}`, { headers: baseHeaders });
	return await response.json();
};

export const getCompanySites = async (id: number): Promise<Company> => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/company/companies/${id}/sites?orderBy=name`, {
		headers: baseHeaders,
	});
	return await response.json();
};

export const getCompanyNotes = async (id: number): Promise<Company> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/company/companies/${id}/notes?orderBy=lastUpdated desc&conditions=text not contains 'DO_NOT_REMOVE_NILEAR'`,
		{
			headers: baseHeaders,
		}
	);
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
	console.log(id);
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_CW_URL}/company/contacts/?conditions=company/id = ${id}&pageSize=1000&orderBy=firstName,lastName`,
			{
				headers: baseHeaders,
			}
		);

		if (response.status !== 200) {
			console.error(response.statusText);
			throw Error('Could not fetch contacts...');
		}

		return await response.json();
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const getConfigurations = async (id?: number): Promise<Contact[]> => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_CW_URL}/company/configurations?fields=id,name,questions,type,notes&conditions=company/id=${id} and status/id=2 and type/id in (211, 212, 219, )&orderBy=name`,
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
export const getCompanyApplications = async (id?: number): Promise<Contact[]> => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_CW_URL}/company/configurations/?conditions=company/id=${id} and status/id=2 and type/id=191&orderBy=name&fields=id,name,questions,type&childConditions=questions/questionId=1597 or questions/questionId=1600 or questions/questionId=1603`,
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
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/service/tickets?conditions=company/id = ${id} and status/id in (615, 995)`,
		{
			headers: baseHeaders,
		}
	);
	return await response.json();
};

export const getTicket = async (id: number): Promise<ServiceTicket> => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/service/tickets/${id}`, {
		headers: baseHeaders,
	});
	return await response.json();
};

export const getTicketNotes = async (id: number): Promise<Note[]> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/service/tickets/${id}/allNotes?orderBy=dateEntered desc`,
		{
			headers: baseHeaders,
		}
	);
	return await response.json();
};

export const getSystemMembers = async (): Promise<SystemMember[]> => {
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
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/service/priorities?orderBy=sortOrder`, {
		headers: baseHeaders,
	});

	if (!response.ok) {
		throw Error('Error fetching priorities...', { cause: response.statusText });
	}

	return await response.json();
};

export const getBoards = async () => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/service/boards?orderBy=name&pageSize=1000`, {
		headers: baseHeaders,
	});

	if (!response.ok) {
		throw Error('Error fetching boards...', { cause: response.statusText });
	}

	return await response.json();
};

export const getProjectStatuses = async (id: number) => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/service/boards/${id}/statuses?orderBy=name`, {
		headers: baseHeaders,
	});

	if (!response.ok) {
		throw Error('Error fetching project statuses...', { cause: response.statusText });
	}

	return await response.json();
};

export const getTriageTickets = async (): Promise<ServiceTicket[]> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/service/tickets?pageSize=1000&conditions=board/id = 30 and closedFlag = false`,
		{
			headers: baseHeaders,
		}
	);

	if (!response.ok) {
		// console.error(response);
		throw Error('Error fetching triage tickets...');
	}

	return await response.json();
};

export const getUserTickets = async (id: number): Promise<ServiceTicket[]> => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/service/tickets`, {
		headers: baseHeaders,
	});

	if (!response.ok) {
		console.error(response.statusText, baseHeaders.get('Authorization'));
		throw Error('Error fetching user tickets...');
	}

	return await response.json();
};

export const getAuditTrail = async (id: number): Promise<AuditTrailEntry[]> => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/system/audittrail?type=Ticket&id=${id}`, {
		headers: baseHeaders,
	});

	if (!response.ok) throw Error('Error fetchnig audit trail...');

	return await response.json();
};

export const getDocuments = async (recordType: RecordType = 'Ticket', id: number): Promise<Document[]> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/system/documents?recordType=${recordType}&recordId=${id}`,
		{
			headers: baseHeaders,
		}
	);

	if (!response.ok) throw Error('Error fetching documents...');

	return await response.json();
};

export const getSchedule = async (id: number = 1): Promise<Schedule> => {
	console.log(id);
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/system/schedules/${id}`, {
		headers: baseHeaders,
	});

	console.log(response.headers);

	if (!response.ok) throw Error('Error fetching schedule...');

	return await response.json();
};

export const getHoliday = async (
	id: number = 13,
	date: string = Intl.DateTimeFormat('en-US', { dateStyle: 'short' }).format(new Date())
): Promise<Holiday[]> => {
	console.log(date);
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/schedule/holidayLists/${id}/holidays?conditions=date = [${date}]`,
		{
			headers: baseHeaders,
		}
	);

	if (!response.ok) throw Error('Error fetching holiday...');

	return await response.json();
};
