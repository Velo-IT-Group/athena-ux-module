'use server';
import { type Conditions, generateParams, baseHeaders } from '@/utils/manage/params';
import type {
	AuditTrailEntry,
	Board,
	BoardStatus,
	Company,
	Configuration,
	Contact,
	Document,
	Holiday,
	Location,
	Note,
	Priority,
	RecordType,
	Schedule,
	ServiceTicket,
	Site,
	SystemMember,
} from '@/types/manage';

export const getCompany = async (id: number, conditions?: Conditions<Company>): Promise<Company> => {
	let params = conditions ? generateParams(conditions) : undefined;

	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/company/companies/${id}${`?${params}`}`, {
		headers: baseHeaders,
	});
	return await response.json();
};

export const getCompanies = async (conditions?: Conditions<Company>): Promise<Company[]> => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/company/companies${generateParams(conditions)}`, {
		headers: baseHeaders,
		method: 'GET',
	});

	if (!response.ok) {
		console.error(response.statusText);
	}

	return await response.json();
};

export const getCompanySites = async (id: number, conditions?: Conditions<Site>): Promise<Site[]> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/company/companies/${id}/sites${generateParams(conditions)}`,
		{
			headers: baseHeaders,
		}
	);
	return await response.json();
};

export const getCompanyNotes = async (id: number, conditions?: Conditions<Note>): Promise<Note[]> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/company/companies/${id}/notes${generateParams(conditions)}`,
		{
			headers: baseHeaders,
		}
	);
	return await response.json();
};

export const getContact = async (id?: number, conditions?: Conditions<Contact>): Promise<Contact | undefined> => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_CW_URL}/company/contacts/${id}/${generateParams(conditions)}`,
			{ headers: baseHeaders }
		);

		if (response.status !== 200) throw Error('Could not find contact...');

		return await response.json();
	} catch (error) {
		console.error(error);
	}
};

export const getContacts = async (conditions?: Conditions<Contact>): Promise<Contact[]> => {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/company/contacts/${generateParams(conditions)}`, {
			headers: baseHeaders,
		});

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

export const getConfiguration = async (id: number, conditions?: Conditions<Configuration>): Promise<Configuration> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/company/configurations/${id}/${generateParams(conditions)}`,
		{
			headers: baseHeaders,
		}
	);

	if (response.status !== 200) throw Error(`Could not fetch configuration for ${id}...`);

	return await response.json();
};

export const getConfigurations = async (conditions?: Conditions<Configuration>): Promise<Configuration[]> => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_CW_URL}/company/configurations/${generateParams(conditions)}`,
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

export const getTickets = async (conditions?: Conditions<ServiceTicket>): Promise<ServiceTicket[]> => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/service/tickets${generateParams(conditions)}`, {
		headers: baseHeaders,
	});
	return await response.json();
};

export const getTicket = async (id: number, conditions?: Conditions<ServiceTicket>): Promise<ServiceTicket> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/service/tickets/${id}/${generateParams(conditions)}`,
		{
			headers: baseHeaders,
		}
	);
	return await response.json();
};

export const getTicketNotes = async (id: number, conditions?: Conditions<Note>): Promise<Note[]> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/service/tickets/${id}/allNotes/${generateParams(conditions)}`,
		{
			headers: baseHeaders,
		}
	);
	return await response.json();
};

export const getSystemMember = async (id: number, conditions?: Conditions<SystemMember>): Promise<SystemMember> => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/system/members/${id}/${generateParams(conditions)}`, {
		headers: baseHeaders,
	});

	return await response.json();
};

export const getSystemMembers = async (conditions?: Conditions<SystemMember>): Promise<SystemMember[]> => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/system/members/${generateParams(conditions)}`, {
		headers: baseHeaders,
	});

	return await response.json();
};

export const getStatuses = async (id: number, conditions?: Conditions<BoardStatus>): Promise<BoardStatus[]> => {
	console.log(id);
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/service/boards/${id}/statuses/${generateParams(conditions)}`,
		{
			headers: baseHeaders,
		}
	);

	if (!response.ok) {
		console.error(response.statusText);
		throw Error('Error fetching service board statuses...', { cause: response.statusText });
	}

	return await response.json();
};

export const getPriorities = async (conditions?: Conditions<Priority>): Promise<Priority[]> => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/service/priorities/${generateParams(conditions)}`, {
		headers: baseHeaders,
	});

	if (!response.ok) {
		throw Error('Error fetching priorities...', { cause: response.statusText });
	}

	return await response.json();
};

export const getBoards = async (conditions?: Conditions<Board>): Promise<Board[]> => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/service/boards/${generateParams(conditions)}`, {
		headers: baseHeaders,
	});

	if (!response.ok) {
		throw Error('Error fetching boards...', { cause: response.statusText });
	}

	return await response.json();
};

export const getAuditTrail = async (
	type: RecordType,
	id: number,
	conditions?: Conditions<AuditTrailEntry>
): Promise<AuditTrailEntry[]> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/system/audittrail?type=${type}&id=${id}${generateParams(conditions)?.replace(
			'?',
			'&'
		)}`,
		{
			headers: baseHeaders,
		}
	);

	if (!response.ok) throw Error('Error fetchnig audit trail...');

	return await response.json();
};

export const getDocuments = async (
	recordType: RecordType,
	id: number,
	conditions?: Conditions<Document>
): Promise<Document[]> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/system/documents?recordType=${recordType}&recordId=${id}${generateParams(
			conditions
		)?.replace('?', '&')}`,
		{
			headers: baseHeaders,
		}
	);

	if (!response.ok) throw Error('Error fetching documents...');

	return await response.json();
};

export const getSchedule = async (id: number = 1, conditions?: Conditions<Schedule>): Promise<Schedule> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/system/schedules/${id}/${generateParams(conditions)}`,
		{
			headers: baseHeaders,
		}
	);

	if (!response.ok) throw Error('Error fetching schedule...');

	return await response.json();
};

export const getHoliday = async (
	id: number = 13,
	date: string = Intl.DateTimeFormat('en-US', { dateStyle: 'short' }).format(new Date()),
	conditions?: Conditions<Holiday>
): Promise<Holiday[]> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/schedule/holidayLists/${id}/holidays${generateParams(conditions)}`,
		{
			headers: baseHeaders,
		}
	);

	if (!response.ok) throw Error('Error fetching holiday...');

	return await response.json();
};

export const getLocations = async (conditions?: Conditions<Location>): Promise<Location[]> => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/system/locations${generateParams(conditions)}`, {
		headers: baseHeaders,
	});
	return await response.json();
};
