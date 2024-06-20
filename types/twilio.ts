export type CustomTaskAttributes = {
	name: string;
	from: string;
	channelType: string;
	channelSid: string;
	userId: number;
	company: string;
	team: string;
	companyId: number;
	userFirstName: string;
	userLastName: string;
	companyName: string;
};

export type WorkerAttributes = {
	full_name: string;
	mobile_phone: string;
	roles: Array<string>;
	contact_uri: string;
	backup_contact_uri?: string;
	work_phone: string;
	selectedCallerId: string;
	direct_dial: string;
	job_title: string;
	email: string;
	on_call: boolean;
};
