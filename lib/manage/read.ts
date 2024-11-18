'use server'
import { type Conditions, generateParams, baseHeaders } from '@/utils/manage/params';
import type {
	Activity,
	AuditTrailEntry,
	Board,
	BoardStatus,
	BoardSubType,
	BoardType,
	CommunicationItem,
	CommunicationType,
	Company,
	CompanyNote,
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
	TimeEntry,
} from '@/types/manage';
import getQueryClient from '@/app/getQueryClient';

const client = getQueryClient();

/*
	COMPANY INFORMATION
*/
export const getCompany = async (id: number, conditions?: Conditions<Company>): Promise<Company> => await client.fetchQuery<Company>({
			queryKey: [
				`/company/companies/${id}`,
				conditions,
			],
		})

export const getCompanies = async (conditions?: Conditions<Company>): Promise<{ data: Company[]; count: number }> => {
	const [data, { count }] = await Promise.all([
		client.fetchQuery<Company[]>({
			queryKey: [
				'/company/companies',
				conditions,
			],
		}),
		client.fetchQuery<{count: number}>({
			queryKey: [
				'/company/companies/count',
				conditions,
			],
		})
	]);

	return {
		data,
		count,
	};
};

export const getCompanySites = async (id: number, conditions?: Conditions<Site>): Promise<Site[]> => await client.fetchQuery<Site[]>({
			queryKey: [
				`/company/companies/${id}/sites`,
				conditions,
			],
		});

export const getCompanyNotes = async (id: number, conditions?: Conditions<CompanyNote>): Promise<{data: CompanyNote[], count: number}> => {
	const [data, { count }] = await Promise.all([
		client.fetchQuery<CompanyNote[]>({
			queryKey: [
				`/company/companies/${id}/notes`,
				conditions,
			],
		}),
		client.fetchQuery<{count: number}>({
			queryKey: [
				`/company/companies/${id}/notes/count`,
				conditions,
			],
		})
	])
	
	return {
		data,
		count
	}
};

export const getCommunicationTypes = async (
	conditions?: Conditions<CommunicationType>
): Promise<CommunicationType[]> => await client.fetchQuery<CommunicationType[]>({
			queryKey: [
				'/company/communicationTypes',
				conditions,
			],
		})

/*
	CONTACT INFORMATION
*/

export const getContact = async (
	id: number | null,
	conditions?: Conditions<Contact>
): Promise<Contact> => await client.fetchQuery<Contact>({
			queryKey: [
				`/company/contacts/${id}`,
				conditions,
			],
		});

export const getContactCommunications = async (
	id: number,
	conditions?: Conditions<CommunicationItem>
): Promise<CommunicationItem[]> => await client.fetchQuery<CommunicationItem[]>({
			queryKey: [
				`/company/contacts/${id}/communications`,
				conditions,
			],
		})

export const getContacts = async (conditions?: Conditions<Contact>): Promise<{ data: Contact[]; count: number }> => {
	const [data, {count}] = await Promise.all([
		await client.fetchQuery<CommunicationItem[]>({
			queryKey: [
				`/company/contacts`,
				conditions,
			],
		}),
		await client.fetchQuery<{count: number}>({
			queryKey: [
				`/company/contacts/count`,
				conditions,
			],
		})
	]);

	return {
		data,
		count,
	};
};

export const getConfiguration = async (id: number, conditions?: Conditions<Configuration>): Promise<Configuration> => await client.fetchQuery<Configuration>({
			queryKey: [
				`/company/configurations/${id}`,
				conditions,
			],
		})

export const getConfigurationTypes = async (
	conditions?: Conditions<ConfigurationType>
): Promise<ConfigurationType[]> => await client.fetchQuery<ConfigurationType[]>({
			queryKey: [
				`/company/configurations/types`,
				conditions,
			],
		})

export const getConfigurations = async (
	conditions?: Conditions<Configuration>
): Promise<{ data: Configuration[]; count: number }> => {
	const [data, {count}] = await Promise.all([
		client.fetchQuery<Configuration[]>({
			queryKey: [
				'/company/configurations',
				conditions,
			],
		}),
		client.fetchQuery<{count: number}>({
			queryKey: [
				'/company/configurations/count',
				conditions,
			],
		})
	]);

	return {
		data,
		count
	};
};

export const getTasks = async (
	id: number,
	conditions?: Conditions<ServiceTicketTask>
): Promise<ServiceTicketTask[]> => await client.fetchQuery<ServiceTicketTask[]>({
			queryKey: [
				`/service/tickets/${id}/tasks`,
				conditions,
			],
		})

export const getTickets = async (
	conditions?: Conditions<ServiceTicket>
): Promise<{ data: ServiceTicket[]; count: number }> => {
	const [
		data,
		{ count },
	] = await Promise.all([
		client.fetchQuery<ServiceTicket[]>({
			queryKey: [
				'/service/tickets',
				conditions,
			],
		}),
		client.fetchQuery<{count: number}>({
			queryKey: [
				'/service/tickets/count',
				conditions,
			],
		})
	]);

	return {
		data,
		count
	};
};


export const getTicket = async (id: number, conditions?: Conditions<ServiceTicket>): Promise<ServiceTicket> => await client.fetchQuery<ServiceTicket>({
			queryKey: [
				`/service/tickets/${id}`,
				conditions,
			],
		})

export const getTicketConfigurations = async (
	id: number,
	conditions?: Conditions<Configuration>
): Promise<Configuration[]> => await client.fetchQuery<Configuration[]>({
			queryKey: [
				`/service/tickets/${id}/configurations`,
				conditions,
			],
		})

export const getTicketNotes = async (id: number, conditions?: Conditions<TicketNote>): Promise<TicketNote[]> => await client.fetchQuery<TicketNote[]>({
			queryKey: [
				`/service/tickets/${id}/notes`,
				conditions,
			],
		})

export const getSystemMember = async (id: number, conditions?: Conditions<SystemMember>): Promise<SystemMember> => await client.fetchQuery<SystemMember>({
			queryKey: [
				`/system/members/${id}`,
				conditions,
			],
})
		
export const getSystemMembers = async (conditions?: Conditions<SystemMember>): Promise<SystemMember[]> => await client.fetchQuery<SystemMember[]>({
			queryKey: [
				`/system/members`,
				conditions,
			],
		})

export const getStatuses = async (id: number, conditions?: Conditions<BoardStatus>): Promise<BoardStatus[]> => await client.fetchQuery<BoardStatus[]>({
			queryKey: [
				`/service/boards/${id}/statuses`,
				conditions,
			],
		})

export const getConfigurationStatuses = async (
	conditions?: Conditions<ConfigurationStatus>
): Promise<{ data: ConfigurationStatus[]; count: number }> => {
	const [data, {count}] = await Promise.all([
		client.fetchQuery<ConfigurationStatus[]>({
			queryKey: [
				'/company/configurations/statuses',
				conditions,
			],
		}),
		client.fetchQuery<{count: number}>({
			queryKey: [
				'/company/configurations/statuses/count',
				conditions,
			],
		})
	]);

	return {
		data,
		count
	};
};

export const getBoardTypes = async (id: number, conditions?: Conditions<BoardType>): Promise<BoardType[]> => await client.fetchQuery<BoardType[]>({
			queryKey: [
				`/service/boards/${id}/types`,
				conditions,
			],
		})

export const getBoardSubTypes = async (id: number, conditions?: Conditions<BoardSubType>): Promise<BoardSubType[]> => await client.fetchQuery<BoardSubType[]>({
			queryKey: [
				`/service/boards/${id}/subTypes`,
				conditions,
			],
		})

export const getPriorities = async (conditions?: Conditions<Priority>): Promise<Priority[]> => await client.fetchQuery<Priority[]>({
			queryKey: [
				`/service/priorities`,
				conditions,
			],
		})

export const getBoards = async (conditions?: Conditions<Board>): Promise<Board[]> => await client.fetchQuery<Board[]>({
			queryKey: [
				`/service/boards`,
				conditions,
			],
		})

export const getProjects = async (conditions?: Conditions<Project>): Promise<{ data: Project[]; count: number }> => {
	const [data, {count}] = await Promise.all([
		client.fetchQuery<Project[]>({
			queryKey: [
				'/project/projects',
				conditions,
			],
		}),
		client.fetchQuery<{count: number}>({
			queryKey: [
				'/project/projects',
				conditions,
			],
		})
	]);

	console.log(data, count)


	return {
		data,
		count
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
): Promise<Document[]> => await client.fetchQuery<Document[]>({
			queryKey: [
				`/system/documents?recordType=${recordType}&recordId=${id}`,
				conditions,
			],
})

export const getSchedule = async (id: number = 2, conditions?: Conditions<Schedule>): Promise<Schedule> =>await client.fetchQuery<Schedule>({
			queryKey: [
				`/schedule/calendars/${id}`,
				conditions,
			],
		})

export const getHoliday = async (
	id: number = 13,
	date: string = Intl.DateTimeFormat('en-US', { dateStyle: 'short' }).format(new Date()),
	conditions?: Conditions<Holiday>
): Promise<Holiday[]> => await client.fetchQuery<Holiday[]>({
			queryKey: [
				`/schedule/holidayLists/${id}/holidays`,
				conditions ? conditions : { conditions: { date: `[${date}]` } },
			],
		})

export const getLocations = async (conditions?: Conditions<Location>): Promise<Location[]> => await client.fetchQuery<Location[]>({
			queryKey: [
				`/system/locations`,
				conditions,
			],
		})

export const getTimeEntries = async (conditions?: Conditions<TimeEntry>): Promise<TimeEntry[]> => await client.fetchQuery<TimeEntry[]>({
			queryKey: [
				`/time/entries`,
				conditions,
			],
})

export const getActivities = async (conditions?: Conditions<Activity>): Promise<Activity[]> => await client.fetchQuery<Activity[]>({
			queryKey: [
				`/sales/activities`,
				conditions,
			],
		})
