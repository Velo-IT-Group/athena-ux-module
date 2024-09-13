'use server';
import { type Conditions, generateParams, baseHeaders } from '@/utils/manage/params';
import type {
	AuditTrailEntry,
	Board,
	BoardStatus,
	BoardSubType,
	BoardType,
	CommunicationItem,
	CommunicationType,
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
	ServiceTicketTask,
	Site,
	SystemMember,
	TicketNote,
} from '@/types/manage';

export const getCompany = async (id: number, conditions?: Conditions<Company>): Promise<Company> => {
	const response = await fetch(`${process.env.CONNECT_WISE_URL}/company/companies/${id}${generateParams(conditions)}`, {
		headers: baseHeaders,
	});
	return await response.json();
};

export const getCompanies = async (
	conditions?: Conditions<Company>
): Promise<{ companies: Company[]; count: number }> => {
	const [response, countResponse] = await Promise.all([
		fetch(`${process.env.CONNECT_WISE_URL}/company/companies${generateParams(conditions)}`, {
			headers: baseHeaders,
			method: 'GET',
		}),
		fetch(`${process.env.CONNECT_WISE_URL}/company/companies/count${generateParams(conditions)}`, {
			headers: baseHeaders,
			method: 'GET',
		}),
	]);

	if (!response.ok || !countResponse.ok) {
		console.error(response.statusText ?? countResponse.statusText);
	}

	const { count } = await countResponse.json();

	return {
		companies: await response.json(),
		count,
	};
};

export const getCompanySites = async (id: number, conditions?: Conditions<Site>): Promise<Site[]> => {
	const response = await fetch(
		`${process.env.CONNECT_WISE_URL}/company/companies/${id}/sites${generateParams(conditions)}`,
		{
			headers: baseHeaders,
		}
	);

	console.log(response.statusText);

	return await response.json();
};

export const getCompanyNotes = async (id: number, conditions?: Conditions<Note>): Promise<Note[]> => {
	const response = await fetch(
		`${process.env.CONNECT_WISE_URL}/company/companies/${id}/notes${generateParams(conditions)}`,
		{
			headers: baseHeaders,
		}
	);
	return await response.json();
};

export const getContact = async (id: number, conditions?: Conditions<Contact>): Promise<Contact | undefined> => {
	try {
		const response = await fetch(
			`${process.env.CONNECT_WISE_URL}/company/contacts/${id}/${generateParams(conditions)}`,
			{ headers: baseHeaders }
		);

		if (response.status !== 200) throw Error('Could not find contact...');

		return await response.json();
	} catch (error) {
		console.error(error);
	}
};

export const getCommunicationTypes = async (
	conditions?: Conditions<CommunicationType>
): Promise<CommunicationType[] | undefined> => {
	try {
		const response = await fetch(
			`${process.env.CONNECT_WISE_URL}/company/communicationTypes${generateParams(conditions)}`,
			{ headers: baseHeaders }
		);

		if (response.status !== 200) throw Error('Could not find communication types...');

		return await response.json();
	} catch (error) {
		console.error(error);
	}
};

export const getContactCommunications = async (
	id?: number,
	conditions?: Conditions<CommunicationItem>
): Promise<CommunicationItem[] | undefined> => {
	if (!id) return [];
	try {
		const response = await fetch(
			`${process.env.CONNECT_WISE_URL}/company/contacts/${id}/communications${generateParams(conditions)}`,
			{ headers: baseHeaders }
		);

		if (response.status !== 200) throw Error('Could not find contact communications...');

		return await response.json();
	} catch (error) {
		console.error(error);
	}
};

export const getContacts = async (conditions?: Conditions<Contact>): Promise<Contact[]> => {
	try {
		const response = await fetch(`${process.env.CONNECT_WISE_URL}/company/contacts/${generateParams(conditions)}`, {
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

export const getAllContacts = async (
	conditions?: Conditions<Contact>
): Promise<{ contacts: Contact[]; count: number }> => {
	let contacts: Contact[] = [];
	const responseCount = await fetch(
		`${process.env.CONNECT_WISE_URL}/company/contacts/count${generateParams(conditions)}`,
		{
			headers: baseHeaders,
		}
	);

	const { count } = await responseCount.json();

	const pageCount = Math.ceil(count / 1000);

	try {
		if (pageCount > 1) {
			const arrayCount = Array(pageCount).fill(null);

			const [...allResponses] = await Promise.all(
				arrayCount.map((_, index) =>
					fetch(
						`${process.env.CONNECT_WISE_URL}/company/contacts/${generateParams({
							...conditions,
							page: index + 1,
							pageSize: 1000,
						})}`,
						{
							headers: baseHeaders,
						}
					)
				)
			);

			const [...data] = await Promise.all(allResponses.flatMap((response) => response.json()));
			const items: Contact[] = data.flatMap((item) => item);
			contacts = items;
		} else {
			const response = await fetch(`${process.env.CONNECT_WISE_URL}/company/contacts${generateParams(conditions)}`, {
				headers: baseHeaders,
			});

			if (!response.ok) {
				console.error(response.statusText);
				throw Error('Could not fetch contacts...');
			}

			return {
				contacts: await response.json(),
				count,
			};
		}
	} catch (error) {
		console.error(error);
		return { contacts: [], count: 0 };
	}

	return {
		contacts,
		count,
	};
};

export const getConfiguration = async (id: number, conditions?: Conditions<Configuration>): Promise<Configuration> => {
	const response = await fetch(
		`${process.env.CONNECT_WISE_URL}/company/configurations/${id}/${generateParams(conditions)}`,
		{
			headers: baseHeaders,
		}
	);

	if (response.status !== 200) throw Error(`Could not fetch configuration for ${id}...`);

	return await response.json();
};

export const getAllConfigurations = async (
	conditions?: Conditions<Configuration>
): Promise<{ configurations: Configuration[]; count: number }> => {
	let configurations: Configuration[] = [];

	const responseCount = await fetch(
		`${process.env.CONNECT_WISE_URL}/company/configurations/count${generateParams(conditions)}`,
		{
			headers: baseHeaders,
		}
	);

	const { count } = await responseCount.json();

	const pageCount = Math.ceil(count / 1000);

	try {
		if (pageCount > 1) {
			const arrayCount = Array(pageCount).fill(null);

			const [...allResponses] = await Promise.all(
				arrayCount.map((_, index) =>
					fetch(
						`${process.env.CONNECT_WISE_URL}/company/configurations${generateParams({
							...conditions,
							page: index + 1,
							pageSize: 1000,
						})}`,
						{
							headers: baseHeaders,
						}
					)
				)
			);

			const [...data] = await Promise.all(allResponses.flatMap((response) => response.json()));
			const items: Configuration[] = data.flatMap((item) => item);
			configurations = items;
		} else {
			const response = await fetch(
				`${process.env.CONNECT_WISE_URL}/company/configurations${generateParams(conditions)}`,
				{
					headers: baseHeaders,
				}
			);

			if (!response.ok) {
				console.error(response.statusText);
				throw Error('Could not fetch configurations...');
			}

			return {
				configurations: await response.json(),
				count,
			};
		}
	} catch (error) {
		console.error(error);
		return { configurations: [], count: 0 };
	}

	return {
		configurations,
		count,
	};
};

export const getConfigurations = async (
	conditions?: Conditions<Configuration>
): Promise<{ configurations: Configuration[]; count: number }> => {
	try {
		const [configResponse, countResponse] = await Promise.all([
			fetch(`${process.env.CONNECT_WISE_URL}/company/configurations${generateParams(conditions)}`, {
				headers: baseHeaders,
			}),
			fetch(`${process.env.CONNECT_WISE_URL}/company/configurations/count${generateParams(conditions)}`, {
				headers: baseHeaders,
			}),
		]);

		if (configResponse.status !== 200 || countResponse.status !== 200) throw Error('Could not fetch configurations...');

		const [configurations, { count }] = await Promise.all([configResponse.json(), countResponse.json()]);

		return {
			configurations,
			count,
		};
	} catch (error) {
		console.error(error);
		return { configurations: [], count: 0 };
	}
};

export const getTasks = async (
	id: number,
	conditions?: Conditions<ServiceTicketTask>
): Promise<ServiceTicketTask[]> => {
	const response = await fetch(
		`${process.env.CONNECT_WISE_URL}/service/tickets/${id}/tasks${generateParams(conditions)}`,
		{
			headers: baseHeaders,
		}
	);

	return await response.json();
};

export const getTickets = async (
	conditions?: Conditions<ServiceTicket>
): Promise<{ tickets: ServiceTicket[]; count: number }> => {
	const [ticketResponse, countResponse] = await Promise.all([
		fetch(`${process.env.CONNECT_WISE_URL}/service/tickets${generateParams(conditions)}`, {
			headers: baseHeaders,
		}),
		fetch(`${process.env.CONNECT_WISE_URL}/service/tickets/count${generateParams(conditions)}`, {
			headers: baseHeaders,
		}),
	]);

	return {
		tickets: await ticketResponse.json(),
		count: (await countResponse.json()).count,
	};
};

export const getAllTickets = async (
	conditions?: Conditions<ServiceTicket>
): Promise<{ tickets: ServiceTicket[]; count: number }> => {
	let tickets: ServiceTicket[] = [];

	const responseCount = await fetch(
		`${process.env.CONNECT_WISE_URL}/service/tickets/count${generateParams(conditions)}`,
		{
			headers: baseHeaders,
		}
	);

	const { count } = await responseCount.json();

	const pageCount = Math.ceil(count / 1000);

	if (pageCount > 1) {
		const arrayCount = Array(pageCount).fill(null);

		const [...allResponses] = await Promise.all(
			arrayCount.map((_, index) =>
				fetch(
					`${process.env.CONNECT_WISE_URL}/service/tickets${generateParams({
						...conditions,
						page: index + 1,
						pageSize: 1000,
					})}`,
					{
						headers: baseHeaders,
					}
				)
			)
		);

		const [...data] = await Promise.all(allResponses.flatMap((response) => response.json()));
		const items: ServiceTicket[] = data.flatMap((item) => item);
		tickets = items;
	} else {
		const response = await fetch(`${process.env.CONNECT_WISE_URL}/service/tickets${generateParams(conditions)}`, {
			headers: baseHeaders,
		});
		return { tickets: await response.json(), count };
	}

	return {
		tickets,
		count,
	};
};

export const getTicket = async (id: number, conditions?: Conditions<ServiceTicket>): Promise<ServiceTicket> => {
	const response = await fetch(`${process.env.CONNECT_WISE_URL}/service/tickets/${id}/${generateParams(conditions)}`, {
		headers: baseHeaders,
	});
	return await response.json();
};

export const getTicketConfigurations = async (
	id: number,
	conditions?: Conditions<Configuration>
): Promise<Configuration[]> => {
	const response = await fetch(
		`${process.env.CONNECT_WISE_URL}/service/tickets/${id}/configurations${generateParams(conditions)}`,
		{
			headers: baseHeaders,
		}
	);

	return await response.json();
};

export const getTicketNotes = async (id: number, conditions?: Conditions<Note>): Promise<TicketNote[]> => {
	const response = await fetch(
		`${process.env.CONNECT_WISE_URL}/service/tickets/${id}/notes/${generateParams(conditions)}`,
		{
			headers: baseHeaders,
		}
	);
	return await response.json();
};

export const getSystemMember = async (id: number, conditions?: Conditions<SystemMember>): Promise<SystemMember> => {
	const response = await fetch(`${process.env.CONNECT_WISE_URL}/system/members/${id}/${generateParams(conditions)}`, {
		headers: baseHeaders,
	});

	return await response.json();
};

export const getSystemMembers = async (conditions?: Conditions<SystemMember>): Promise<SystemMember[]> => {
	const response = await fetch(`${process.env.CONNECT_WISE_URL}/system/members/${generateParams(conditions)}`, {
		headers: baseHeaders,
	});

	return await response.json();
};

export const getStatuses = async (id: number, conditions?: Conditions<BoardStatus>): Promise<BoardStatus[]> => {
	const response = await fetch(
		`${process.env.CONNECT_WISE_URL}/service/boards/${id}/statuses/${generateParams(conditions)}`,
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

export const getBoardTypes = async (id: number, conditions?: Conditions<BoardType>): Promise<BoardType[]> => {
	const response = await fetch(
		`${process.env.CONNECT_WISE_URL}/service/boards/${id}/types/${generateParams(conditions)}`,
		{
			headers: baseHeaders,
		}
	);

	if (!response.ok) {
		console.error(response.statusText);
		throw Error('Error fetching service board types...', { cause: response.statusText });
	}

	return await response.json();
};

export const getBoardSubTypes = async (id: number, conditions?: Conditions<BoardSubType>): Promise<BoardSubType[]> => {
	const response = await fetch(
		`${process.env.CONNECT_WISE_URL}/service/boards/${id}/subTypes${generateParams(conditions)}`,
		{
			headers: baseHeaders,
		}
	);

	if (!response.ok) {
		console.error(response.statusText);
		throw Error('Error fetching service board subtypes...', { cause: response.statusText });
	}

	return await response.json();
};

export const getPriorities = async (conditions?: Conditions<Priority>): Promise<Priority[]> => {
	const response = await fetch(`${process.env.CONNECT_WISE_URL}/service/priorities/${generateParams(conditions)}`, {
		headers: baseHeaders,
	});

	if (!response.ok) {
		throw Error('Error fetching priorities...', { cause: response.statusText });
	}

	return await response.json();
};

export const getBoards = async (conditions?: Conditions<Board>): Promise<Board[]> => {
	const response = await fetch(`${process.env.CONNECT_WISE_URL}/service/boards/${generateParams(conditions)}`, {
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
		`${process.env.CONNECT_WISE_URL}/system/audittrail?type=${type}&id=${id}${generateParams(conditions)?.replace(
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
		`${process.env.CONNECT_WISE_URL}/system/documents?recordType=${recordType}&recordId=${id}${generateParams(
			conditions
		)?.replace('?', '&')}`,
		{
			headers: baseHeaders,
		}
	);

	if (!response.ok) throw Error('Error fetching documents...');

	return await response.json();
};

export const getSchedule = async (id: number = 2, conditions?: Conditions<Schedule>): Promise<Schedule> => {
	const response = await fetch(
		`${process.env.CONNECT_WISE_URL}/schedule/calendars/${id}${generateParams(conditions)}`,
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
	console.log(date);
	const params = generateParams(conditions ? conditions : { conditions: [{ parameter: { date: `[${date}]` } }] });
	const response = await fetch(`${process.env.CONNECT_WISE_URL}/schedule/holidayLists/${id}/holidays${params ?? ''}`, {
		headers: baseHeaders,
	});

	if (!response.ok) throw Error('Error fetching holiday...');

	return await response.json();
};

export const getLocations = async (conditions?: Conditions<Location>): Promise<Location[]> => {
	const response = await fetch(`${process.env.CONNECT_WISE_URL}/system/locations${generateParams(conditions)}`, {
		headers: baseHeaders,
	});
	return await response.json();
};
