'use server'
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
	ConfigurationStatus,
	ConfigurationType,
	Contact,
	Document,
	Holiday,
	Location,
	Note,
	Priority,
	Project,
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

export const getCompanies = async (conditions?: Conditions<Company>): Promise<{ data: Company[]; count: number }> => {
	const params = generateParams(conditions)
	const [response, countResponse] = await Promise.all([
		fetch(`${process.env.CONNECT_WISE_URL}/company/companies${params}`, {
			headers: baseHeaders,
			method: 'GET',
		}),
		fetch(`${process.env.CONNECT_WISE_URL}/company/companies/count${params}`, {
			headers: baseHeaders,
			method: 'GET',
		}),
	]);

	if (!response.ok || !countResponse.ok) {
		console.error(response.statusText ?? countResponse.statusText);
		throw new Error(countResponse.statusText || response.statusText);
	}

	return {
		data: await response.json(),
		count: (await countResponse.json()).count,
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

export const getContact = async (
	id?: number | null,
	conditions?: Conditions<Contact>
): Promise<Contact | undefined> => {
	if (!id) return;
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

export const getContacts = async (conditions?: Conditions<Contact>): Promise<{ data: Contact[]; count: number }> => {
	const generatedConditions = generateParams(conditions);
	const [response, countResponse] = await Promise.all([
		await fetch(`${process.env.CONNECT_WISE_URL}/company/contacts/${generatedConditions}`, {
			headers: baseHeaders,
		}),
		await fetch(`${process.env.CONNECT_WISE_URL}/company/contacts/count${generatedConditions}`, {
			headers: baseHeaders,
		}),
	]);

	if (!response.ok || !countResponse.ok) {
		console.error(response.statusText, await response.json());
		throw new Error(`Could not fetch contacts... ${response.statusText || countResponse.statusText}`);
	}

	return {
		data: await response.json(),
		count: (await countResponse.json()).count,
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

export const getConfigurationTypes = async (
	conditions?: Conditions<ConfigurationType>
): Promise<ConfigurationType[]> => {
	const response = await fetch(
		`${process.env.CONNECT_WISE_URL}/company/configurations/types${generateParams(conditions)}`,
		{
			headers: baseHeaders,
		}
	);

	if (response.status !== 200) throw new Error(response.statusText);

	return await response.json();
};

export const getAllConfigurations = async (
	conditions?: Conditions<Configuration>
): Promise<{ data: Configuration[]; count: number }> => {
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
				data: await response.json(),
				count,
			};
		}
	} catch (error) {
		console.error(error);
		return { data: [], count: 0 };
	}

	return {
		data: [],
		count,
	};
};

export const getConfigurations = async (
	conditions?: Conditions<Configuration>
): Promise<{ data: Configuration[]; count: number }> => {
	const [response, countResponse] = await Promise.all([
		fetch(`${process.env.CONNECT_WISE_URL}/company/configurations${generateParams(conditions)}`, {
			headers: baseHeaders,
		}),
		fetch(`${process.env.CONNECT_WISE_URL}/company/configurations/count${generateParams(conditions)}`, {
			headers: baseHeaders,
		}),
	]);

	if (response.status !== 200 || countResponse.status !== 200) throw Error('Could not fetch configurations...');

	return {
		data: await response.json(),
		count: (await countResponse.json()).count,
	};
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
): Promise<{ data: ServiceTicket[]; count: number }> => {
	const generatedConditions = generateParams(conditions);
	const [
		ticketResponse,
		countResponse,
	] = await Promise.all([
		fetch(`${process.env.CONNECT_WISE_URL}/service/tickets${generatedConditions}`, {
			headers: baseHeaders,
		}),
		fetch(`${process.env.CONNECT_WISE_URL}/service/tickets/count${generatedConditions}`, {
			headers: baseHeaders,
		}),
	]);

	return {
		data: await ticketResponse.json(),
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

export const getConfigurationStatuses = async (
	conditions?: Conditions<ConfigurationStatus>
): Promise<{ data: ConfigurationStatus[]; count: number }> => {
	const [response, countResponse] = await Promise.all([
		fetch(`${process.env.CONNECT_WISE_URL}/company/configurations/statuses/${generateParams(conditions)}`, {
			headers: baseHeaders,
		}),
		fetch(`${process.env.CONNECT_WISE_URL}/company/configurations/statuses/count${generateParams(conditions)}`, {
			headers: baseHeaders,
		}),
	]);

	if (!response.ok || !countResponse.ok) {
		console.error(response.statusText);
		throw Error('Error fetching configuration statuses...', { cause: response.statusText });
	}

	return {
		data: await response.json(),
		count: (await countResponse.json()).count,
	};
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

export const getProjects = async (conditions?: Conditions<Project>): Promise<{ data: Project[]; count: number }> => {
	const headers = new Headers(baseHeaders);
	headers.set('Authorization', 'Basic ' + btoa('velo+X32LB4Xx5GW5MFNz:XcwrfwGpCODhSpvD'));
	const [response, countResponse] = await Promise.all([
		fetch(`${process.env.CONNECT_WISE_URL}/project/projects${generateParams(conditions)}`, {
			headers,
		}),
		fetch(`${process.env.CONNECT_WISE_URL}/project/projects/count${generateParams(conditions)}`, {
			headers,
		}),
	]);

	if (!response.ok || !countResponse.ok) {
		throw new Error('Error fetching projects...', { cause: await response.json() });
	}

	return {
		data: await response.json(),
		count: (await countResponse.json()).count,
	};
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
	const params = generateParams(conditions ? conditions : { conditions: { date: `[${date}]` } });
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
