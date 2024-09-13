import { z } from 'zod';

export const filterTargetSchema = z.object({ queue: z.string() });

export const filtersSchema = z.object({
	targets: z.array(filterTargetSchema),
	expression: z.string(),
	filter_friendly_name: z.string(),
});

export const createPartipantParamsSchema = z.object({
	From: z.string(),
	To: z.string(),
	Label: z.string(),
	EarlyMedia: z.boolean(),
	Beep: z.string(),
	Muted: z.boolean(),
	StatusCallback: z.string(),
	StatusCallbackMethod: z.string(),
	StatusCallbackEvent: z.string(),
	Record: z.boolean(),
	Trim: z.string(),
	TimeLimit: z.number(),
	CallToken: z.string(),
	MachineDetection: z.string(),
	MachineDetectionTimeout: z.number(),
	MachineDetectionSpeechThreshold: z.number(),
	MachineDetectionSpeechEndThreshold: z.number(),
	MachineDetectionSilenceTimeout: z.number(),
	AmdStatusCallback: z.string(),
	AmdStatusCallbackMethod: z.string(),
	MachineDetectionEngine: z.string(),
	MachineDetectionMinWordLength: z.number(),
	MachineDetectionMaxWordLength: z.number(),
	MachineDetectionWordsSilence: z.number(),
	MachineDetectionMaxNumOfWords: z.number(),
	MachineDetectionSilenceThreshold: z.number(),
});

export type CreateParticipantParams = z.infer<typeof createPartipantParamsSchema>;

export const workflowConfigurationSchema = z.object({
	task_routing: z.object({
		filters: z.array(filtersSchema),
	}),
});

export const offsetSchema = z.object({ x: z.number(), y: z.number() });

export const statePropertiesSchema = z.object({
	offset: offsetSchema,
	workflow_sid: z.string().optional(),
	task_attributes: z.string().optional(),
});

export const triggerEventSchema = z.object({
	event: z.enum([
		'incomingMessage',
		'incomingCall',
		'incomingConversationMessage',
		'incomingRequest',
		'incomingParent',
	]),
	next: z.string().optional(),
});

export const flowStateSchema = z.object({
	name: z.string(),
	type: z.enum(['trigger', 'enqueue-call']),
	transitions: z.array(triggerEventSchema).default([]),
	properties: statePropertiesSchema,
});

export const queueSchema = z.object({
	accountSid: z.string(),
	assignmentActivitySid: z.string(),
	assignmentActivityName: z.string(),
	dateCreated: z.string(),
	dateUpdated: z.string(),
	friendlyName: z.string(),
	maxReservedWorkers: z.number(),
	reservationActivitySid: z.string(),
	reservationActivityName: z.string(),
	sid: z.string(),
	targetWorkers: z.string(),
	taskOrder: z.string(),
	url: z.string(),
	workspaceSid: z.string(),
});

export type FlowState = z.infer<typeof flowStateSchema>;
export type FilterTarget = z.infer<typeof filterTargetSchema>;
export type WorkflowConfiguration = z.infer<typeof workflowConfigurationSchema>;
export type Queue = z.infer<typeof queueSchema>;

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
