import { z } from 'zod';

export const referenceTypeSchema = z.object({
	id: z.number(),
	identity: z.string().optional(),
	name: z.string(),
});

export const customFieldSchema = z.object({
	id: z.number().optional(),
	caption: z.string().optional(),
	type: z.string().optional(),
	entryMethod: z.string().optional(),
	numberOfDecimals: z.number().optional(),
	value: z.object({}),
});

export const companyNoteSchema = z.object({
  id: z.number(),
  text: z.string(),
  type: z.object({ id: z.number(), name: z.string() }),
  flagged: z.boolean(),
  enteredBy: z.string(),
  company: z.object({
    id: z.number(),
    identifier: z.string(),
    name: z.string()
  }),
	_info: z.object({
		lastUpdated: z.string(),
		updatedBy: z.string()
  })
})

export const timeEntrySchema = z.object({
  id: z.number(),
  company: referenceTypeSchema,
  companyType: z.string(),
  chargeToId: z.number(),
  chargeToType: z.string(),
  member: z.object({
    id: z.number(),
    identifier: z.string(),
    name: z.string(),
    dailyCapacity: z.number()
  }),
  locationId: z.number(),
  businessUnitId: z.number(),
  businessGroupDesc: z.string(),
	workType: z.object({
    id: z.number(),
    name: z.string(),
    utilizationFlag: z.boolean()
  }),
  workRole: referenceTypeSchema,
  agreement: referenceTypeSchema,
  agreementType: z.string(),
  activity: referenceTypeSchema,
  opportunityRecid: z.number(),
  projectActivity: z.string(),
  territory: z.string(),
  timeStart: z.string(),
  timeEnd: z.string(),
  hoursDeduct: z.number(),
  actualHours: z.number(),
  billableOption: z.string(),
  notes: z.string(),
  internalNotes: z.string(),
  addToDetailDescriptionFlag: z.boolean(),
  addToInternalAnalysisFlag: z.boolean(),
  addToResolutionFlag: z.boolean(),
  emailResourceFlag: z.boolean(),
	emailContactFlag: z.boolean(),
  emailCcFlag: z.boolean(),
  emailCc: z.string(),
  hoursBilled: z.number(),
  invoiceHours: z.number(),
  hourlyCost: z.string(),
  enteredBy: z.string(),
  dateEntered: z.string(),
  invoice: referenceTypeSchema,
  mobileGuid: z.string(),
  hourlyRate: z.number(),
  overageRate: z.number(),
  agreementHours: z.number(),
  agreementAmount: z.number(),
  agreementAdjustment: z.number(),
  adjustment: z.number(),
  invoiceReady: z.number(),
  timeSheet: referenceTypeSchema,
  status: z.string(),
  ticket: z.object({ id: z.number(), summary: z.string() }),
  project:referenceTypeSchema,
  phase: referenceTypeSchema,
  ticketBoard: z.string(),
  ticketStatus: z.string(),
  ticketType: z.string(),
  ticketSubType: z.string(),
  invoiceFlag: z.boolean(),
  extendedInvoiceAmount: z.number(),
  locationName: z.string(),
  taxCode: referenceTypeSchema,
  customFields: z.array(
    z.object({
      id: z.number(),
      caption: z.string(),
      type: z.string(),
      entryMethod: z.string(),
      numberOfDecimals: z.number(),
      value: z.object({})
    })
  )
})

const auditTypeSchema = z.enum([
	'Attachment',
	'Combined Tickets',
	'Company',
	'Configuration',
	'Contact',
	'Control',
	'Custom Field',
	'Date',
	'Email',
	'Finance',
	'Knowledge Base',
	'Meeting',
	'Notes',
	'Product',
	'Record',
	'Resource',
	'SLA',
	'Task',
	'Template',
	'Tickets',
	'Ticket Template',
	'Time Entry',
	'Workflow',
]);

export const auditTrailEntrySchema = z.object({
	text: z.string(),
	enteredDate: z.string(),
	enteredBy: z.string(),
	auditType: auditTypeSchema,
	auditSubType: z.string(),
	auditSource: z.string(),
});

export const boardStatusSchema = z.object({
	id: z.number(),
	name: z.string().max(50),
	board: referenceTypeSchema.optional(),
	sortOrder: z.number().optional().nullable(),
	displayOnBoard: z.boolean().optional().nullable(),
	inactive: z.boolean().optional().nullable(),
	closedStatus: z.boolean().optional().nullable(),
	timeEntryNotAllowed: z.boolean().optional().nullable(),
	roundRobinCatchall: z.boolean().optional().nullable(),
	defaultFlag: z.boolean().optional().nullable(),
	escalationStatus: z.string().optional().nullable(),
	customerPortalDescription: z.string().optional().nullable(),
	customerPortalFlag: z.boolean().optional().nullable(),
	emailTemplate: referenceTypeSchema.optional().nullable(),
	statusIndicator: referenceTypeSchema.optional().nullable(),
	customStatusIndicatorName: z.string().optional().nullable(),
	saveTimeAsNote: z.boolean().optional().nullable(),
});

export const boardTypeSchema = z.object({
	id: z.number(),
	name: z.string().max(50),
	category: z.enum(['Reactive', 'Proactive']).nullable(),
	defaultFlag: z.boolean().nullable(),
	inactiveFlag: z.boolean().nullable(),
	requestForChangeFlag: z.boolean().nullable(),
	integrationXref: z.string().nullable(),
	skillCategory: referenceTypeSchema.nullable(),
	skill: referenceTypeSchema.nullable(),
	board: referenceTypeSchema.nullable(),
	location: referenceTypeSchema.nullable(),
	department: referenceTypeSchema.nullable(),
});

export const boardSubTypeSchema = z.object({
	id: z.number(),
	name: z.string().max(50),
	inactiveFlag: z.boolean().nullable(),
	typeAssociationIds: z.array(z.number()),
	addAllTypesFlag: z.boolean().nullable(),
	removeAllTypesFlag: z.boolean().nullable(),
	board: referenceTypeSchema,
});

export const communicationItemSchema = z.object({
	id: z.number(),
	type: referenceTypeSchema,
	value: z.string(),
	defaultFlag: z.boolean().optional(),
	domain: z.string().optional(),
	communicationType: z.enum(['Email', 'Fax', 'Phone']).optional(),
});

export const contactSchema = z.object({
	id: z.number(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	company: referenceTypeSchema.optional(),
	site: referenceTypeSchema.optional(),
	addressLine1: z.string().optional(),
	addressLine2: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	school: z.string().optional(),
	date: z.string().optional(),
	zip: z.string().optional(),
	country: referenceTypeSchema.optional(),
	relationshipOverride: z.string().optional(),
	inactiveFlag: z.boolean().optional(),
	managerContact: referenceTypeSchema.optional(),
	title: z.string().optional(),
	nickName: z.string().optional(),
	marriedFlag: z.boolean().optional(),
	childrenFlag: z.boolean().optional(),
	significantOther: z.string().optional(),
	portalSecurityLevel: z.number().optional(),
	disablePortalLoginFlag: z.boolean().optional(),
	unsubscribeFlag: z.boolean().optional(),
	gender: z.string().optional(),
	birthDay: z.string().optional(),
	anniversary: z.string().optional(),
	mobileGuid: z.string().optional(),
	defaultPhoneType: z.string().optional(),
	defaultPhoneNbr: z.string().optional(),
	defaultBillingFlag: z.boolean().optional(),
	defaultFlag: z.boolean().optional(),
	communicationItems: z.array(communicationItemSchema).optional(),
	types: z.array(referenceTypeSchema).optional(),
	ignoreDuplicates: z.boolean().optional(),
});

export const serviceTicketSchema = z.object({
	id: z.number(),
	summary: z.string().max(100),
	recordType: z.enum(['ProjectIssue', 'ProjectTicket', 'ServiceTicket']).optional().default('ServiceTicket'),
	board: referenceTypeSchema.optional(),
	status: referenceTypeSchema.optional(),
	workRole: referenceTypeSchema.optional(),
	workType: referenceTypeSchema.optional(),
	company: referenceTypeSchema.optional(),
	site: referenceTypeSchema.optional(),
	siteName: z.string().max(50).optional(),
	addressLine1: z.string().max(50).optional(),
	addressLine2: z.string().max(50).optional(),
	city: z.string().max(50).optional(),
	stateIdentifier: z.string().max(50).optional(),
	zip: z.string().max(12).optional(),
	country: referenceTypeSchema.optional(),
	contact: referenceTypeSchema.optional(),
	contactName: z.string().max(62).optional(),
	contactPhoneNumber: z.string().max(20).optional(),
	contactPhoneExtension: z.string().max(15).optional(),
	contactEmailAddress: z.string().max(250).optional(),
	type: referenceTypeSchema.optional(),
	subType: referenceTypeSchema.optional(),
	item: referenceTypeSchema.optional(),
	team: referenceTypeSchema.optional(),
	owner: referenceTypeSchema.optional(),
	priority: referenceTypeSchema.optional(),
	serviceLocation: referenceTypeSchema.optional(),
	source: referenceTypeSchema.optional(),
	requiredDate: z.string().optional(),
	budgetHours: z.number().optional(),
	opportunity: referenceTypeSchema.optional(),
	agreement: referenceTypeSchema.optional(),
	severity: z.enum(['Low', 'Medium', 'High']).optional(),
	impact: z.enum(['Low', 'Medium', 'High']).optional(),
	externalXRef: z.string().max(100).optional(),
	poNumber: z.string().max(50).optional(),
	knowledgeBaseCategoryId: z.number().optional(),
	knowledgeBaseSubCategoryId: z.number().optional(),
	allowAllClientsPortalView: z.boolean().optional(),
	customerUpdatedFlag: z.boolean().optional(),
	automaticEmailContactFlag: z.boolean().optional(),
	automaticEmailResourceFlag: z.boolean().optional(),
	automaticEmailCcFlag: z.boolean().optional(),
	automaticEmailCc: z.string().max(100).optional(),
	initialDescription: z.string().optional(),
	initialInternalAnalysis: z.string().optional(),
	initialResolution: z.string().optional(),
	initialDescriptionFrom: z.string().optional(),
	contactEmailLookup: z.string().optional(),
	processNotifications: z.boolean().optional(),
	skipCallback: z.boolean().optional(),
	closedDate: z.string().optional(),
	closedBy: z.string().optional(),
	closedFlag: z.boolean().optional(),
	actualHours: z.number().optional(),
	approved: z.boolean().optional(),
	estimatedExpenseCost: z.number().optional(),
	estimatedExpenseRevenue: z.number().optional(),
	estimatedProductCost: z.number().optional(),
	estimatedProductRevenue: z.number().optional(),
	estimatedTimeCost: z.number().optional(),
	estimatedTimeRevenue: z.number().optional(),
	billingMethod: z.enum(['ActualRates', 'FixedFee', 'NotToExceed', 'OverrideRate']).optional(),
	billingAmount: z.number().optional(),
	hourlyRate: z.number().optional(),
	subBillingMethod: z.enum(['ActualRates', 'FixedFee', 'NotToExceed', 'OverrideRate']).optional(),
	subBillingAmount: z.number().optional(),
	subDateAccepted: z.string().optional(),
	dateResolved: z.string().optional(),
	dateResplan: z.string().optional(),
	dateResponded: z.string().optional(),
	resolveMinutes: z.number().optional(),
	resPlanMinutes: z.number().optional(),
	respondMinutes: z.number().optional(),
	isInSla: z.boolean().optional(),
	knowledgeBaseLinkId: z.number().optional(),
	resources: z.string().optional(),
	parentTicketId: z.number().optional(),
	hasChildTicket: z.boolean().optional(),
	hasMergedChildTicketFlag: z.boolean().optional(),
	knowledgeBaseLinkType: z.string().optional(),
	billTime: z.enum(['Billable', 'DoNotBill', 'NoCharge', 'NoDefault']).optional(),
	billExpenses: z.enum(['Billable', 'DoNotBill', 'NoCharge', 'NoDefault']).optional(),
	billProducts: z.enum(['Billable', 'DoNotBill', 'NoCharge', 'NoDefault']).optional(),
	predecessorType: z.enum(['Ticket', 'Phase']).optional(),
	predecessorId: z.number().optional(),
	predecessorClosedFlag: z.boolean().optional(),
	lagDays: z.number().optional(),
	lagNonworkingDaysFlag: z.boolean().optional(),
	estimatedStartDate: z.string().optional(),
	duration: z.number().optional(),
	location: referenceTypeSchema.optional(),
	department: referenceTypeSchema.optional(),
	mobileGuid: z.string().optional(),
	sla: referenceTypeSchema.optional(),
	slaStatus: z.string().optional(),
	requestForChangeFlag: z.boolean().optional(),
	currency: referenceTypeSchema.optional(),
	mergedParentTicket: referenceTypeSchema.optional(),
	integratorTags: z.array(z.string()),
	escalationStartDateUTC: z.string().optional(),
	escalationLevel: z.number().optional(),
	minutesBeforeWaiting: z.number().optional(),
	respondedSkippedMinutes: z.number().optional(),
	resplanSkippedMinutes: z.number().optional(),
	respondedHours: z.number().optional(),
	respondedBy: z.string().optional(),
	resplanHours: z.number().optional(),
	resplanBy: z.string().optional(),
	resolutionHours: z.number().optional(),
	resolvedBy: z.string().optional(),
	minutesWaiting: z.number().optional(),
	customFields: z.array(customFieldSchema).optional(),
});

export const documentSchema = z.object({
	id: z.number().optional(),
	title: z.string().optional(),
	fileName: z.string().optional(),
	serverFileName: z.string().optional(),
	owner: z.string().optional(),
	linkFlag: z.boolean().optional(),
	imageFlag: z.boolean().optional(),
	publicFlag: z.boolean().optional(),
	htmlTemplateFlag: z.boolean().optional(),
	readOnlyFlag: z.boolean().optional(),
	size: z.number().optional(),
	urlFlag: z.boolean().optional(),
	createdOnDate: z.string().optional(),
	documentType: referenceTypeSchema.optional(),
	guid: z.string().optional(),
});

export const systemMemberSchema = z.object({
	id: z.number(),
	identifier: z.string().max(15),
	password: z.string().optional(),
	disableOnlineFlag: z.boolean().optional(),
	licenseClass: z.enum(['A', 'C', 'F', 'X']).optional(),
	notes: z.string().optional(),
	employeeIdentifer: z.string().optional(),
	vendorNumber: z.string().optional(),
	enableMobileGpsFlag: z.boolean().optional(),
	inactiveDate: z.string().optional(),
	inactiveFlag: z.boolean().optional(),
	lastLogin: z.string().optional(),
	clientId: z.string().optional(),
	token: z.string().optional(),
	firstName: z.string().max(30),
	middleInitial: z.string().optional(),
	lastName: z.string().max(30),
	hireDate: z.string(),
	country: referenceTypeSchema.optional(),
	photo: referenceTypeSchema.optional(),
	officeEmail: z.string().optional(),
	mobileEmail: z.string().optional(),
	homeEmail: z.string().optional(),
	defaultEmail: z.enum(['Office', 'Mobile', 'Home']),
	primaryEmail: z.string().optional(),
	officePhone: z.string().optional(),
	officeExtension: z.string().optional(),
	mobilePhone: z.string().optional(),
	mobileExtension: z.string().optional(),
	homePhone: z.string().optional(),
	homeExtension: z.string().optional(),
	defaultPhone: z.enum(['Office', 'Mobile', 'Home']),
	securityRole: referenceTypeSchema,
	office365: referenceTypeSchema.optional(),
	mapiName: z.string().optional(),
	calendarSyncIntegrationFlag: z.boolean().optional(),
	authenticationServiceType: z.enum(['AuthAnvil', 'GoogleAuthenticator', 'Email']).optional(),
	timebasedOneTimePasswordActivated: z.boolean().optional(),
	enableLdapAuthenticationFlag: z.boolean().optional(),
	ldapConfiguration: referenceTypeSchema.optional(),
	ldapUserName: z.string().optional(),
	directionalSync: referenceTypeSchema.optional(),
	ssoSettings: referenceTypeSchema.optional(),
	signature: z.string().optional(),
	phoneIntegrationType: z.enum(['TAPI', 'SKYPE', 'TEL', 'CALLTO', 'NONE']).optional(),
	useBrowserLanguageFlag: z.boolean().optional(),
	title: z.string().optional(),
	reportCard: referenceTypeSchema.optional(),
	enableMobileFlag: z.boolean().optional(),
	type: referenceTypeSchema.optional(),
	timeZone: referenceTypeSchema.optional(),
	partnerPortalFlag: z.boolean().optional(),
	stsUserAdminUrl: z.string().optional(),
	toastNotificationFlag: z.boolean().optional(),
	memberPersonas: z.array(z.number()),
	adminFlag: z.boolean().optional(),
	structureLevel: referenceTypeSchema.optional(),
	securityLocation: referenceTypeSchema.optional(),
	defaultLocation: referenceTypeSchema.optional(),
	defaultDepartment: referenceTypeSchema.optional(),
	reportsTo: referenceTypeSchema.optional(),
	restrictLocationFlag: z.boolean().optional(),
	restrictDepartmentFlag: z.boolean().optional(),
	workRole: referenceTypeSchema.optional(),
	workType: referenceTypeSchema.optional(),
	timeApprover: referenceTypeSchema.optional(),
	expenseApprover: referenceTypeSchema.optional(),
	billableForecast: z.number().optional(),
	dailyCapacity: z.number().optional(),
	hourlyCost: z.number().optional(),
	hourlyRate: z.number().optional(),
	includeInUtilizationReportingFlag: z.boolean().optional(),
	requireExpenseEntryFlag: z.boolean().optional(),
	requireTimeSheetEntryFlag: z.boolean().optional(),
	requireStartAndEndTimeOnTimeEntryFlag: z.boolean().optional(),
	allowInCellEntryOnTimeSheet: z.boolean().optional(),
	enterTimeAgainstCompanyFlag: z.boolean().optional(),
	allowExpensesEnteredAgainstCompaniesFlag: z.boolean().optional(),
	timeReminderEmailFlag: z.boolean().optional(),
	daysTolerance: z.number().optional(),
	minimumHours: z.number().optional(),
	timeSheetStartDate: z.string().optional(),
	serviceDefaultLocation: referenceTypeSchema.optional(),
	serviceDefaultDepartment: referenceTypeSchema.optional(),
	serviceDefaultBoard: referenceTypeSchema.optional(),
	restrictServiceDefaultLocationFlag: z.boolean().optional(),
	restrictServiceDefaultDepartmentFlag: z.boolean().optional(),
	excludedServiceBoardIds: z.array(z.number()),
	teams: z.array(z.number()),
	serviceBoardTeamIds: z.array(z.number()),
	projectDefaultLocation: referenceTypeSchema.optional(),
	projectDefaultDepartment: referenceTypeSchema.optional(),
	projectDefaultBoard: referenceTypeSchema.optional(),
	restrictProjectDefaultLocationFlag: z.boolean().optional(),
	restrictProjectDefaultDepartmentFlag: z.boolean().optional(),
	excludedProjectBoardIds: z.array(z.number()),
	scheduleDefaultLocation: referenceTypeSchema.optional(),
	scheduleDefaultDepartment: referenceTypeSchema.optional(),
	scheduleCapacity: z.number().optional(),
	serviceLocation: referenceTypeSchema.optional(),
	restrictScheduleFlag: z.boolean().optional(),
	hideMemberInDispatchPortalFlag: z.boolean().optional(),
	calendar: referenceTypeSchema.optional(),
	salesDefaultLocation: referenceTypeSchema.optional(),
	restrictDefaultSalesTerritoryFlag: z.boolean().optional(),
	warehouse: referenceTypeSchema.optional(),
	warehouseBin: referenceTypeSchema.optional(),
	restrictDefaultWarehouseFlag: z.boolean().optional(),
	restrictDefaultWarehouseBinFlag: z.boolean().optional(),
	companyActivityTabFormat: z.enum(['SummaryList', 'DetailList']).optional(),
	invoiceTimeTabFormat: z.enum(['SummaryList', 'DetailList']).optional(),
	invoiceScreenDefaultTabFormat: z.enum(['ShowInvoicingTab', 'ShowAgreementInvoicingTab']).optional(),
	invoicingDisplayOptions: z.enum(['RemainOnInvoicingScreen', 'ShowRecentInvoices']).optional().nullable(),
	agreementInvoicingDisplayOptions: z.enum(['RemainOnInvoicingScreen', 'ShowRecentInvoices']).optional().nullable(),
	autoStartStopwatch: z.boolean().optional(),
	autoPopupQuickNotesWithStopwatch: z.boolean().optional(),
	globalSearchDefaultTicketFilter: z.enum(['OpenRecords', 'ClosedRecords', 'AllRecords']).optional().nullable(),
	globalSearchDefaultSort: z
		.enum(['None', 'LastUpdatedDesc', 'LastUpdatedAsc', 'CreatedDesc', 'CreatedAsc'])
		.optional(),
	phoneSource: z.string().optional(),
	copyPodLayouts: z.boolean().optional(),
	copySharedDefaultViews: z.boolean().optional(),
	copyColumnLayoutsAndFilters: z.boolean().optional(),
	fromMemberRecId: z.number().optional(),
	fromMemberTemplateRecId: z.number(),
});

export const projectSchema = z.object({
	id: z.number(),
	actualEnd: z.string().optional(),
	actualHours: z.number().optional(),
	actualStart: z.string().optional(),
	agreement: referenceTypeSchema.optional(),
	billExpenses: z.string().optional(),
	billingAmount: z.number().optional(),
	billingAttention: z.string().optional(),
	billingMethod: z.string().optional(),
	billingRateType: z.string().optional(),
	billingTerms: referenceTypeSchema.optional(),
	billProducts: z.string().optional(),
	billProjectAfterClosedFlag: z.boolean().optional(),
	billTime: z.string().optional(),
	billToCompany: referenceTypeSchema.optional(),
	billToContact: referenceTypeSchema.optional(),
	billToSite: referenceTypeSchema.optional(),
	billUnapprovedTimeAndExpense: z.boolean().optional(),
	board: referenceTypeSchema.optional(),
	budgetAnalysis: z.string().optional(),
	budgetFlag: z.boolean().optional(),
	budgetHours: z.number().optional(),
	company: referenceTypeSchema.optional(),
	contact: referenceTypeSchema.optional(),
	customerPO: z.string().optional(),
	description: z.string().optional(),
	currency: referenceTypeSchema.optional(),
	downpayment: z.number().optional(),
	estimatedEnd: z.string().optional(),
	percentComplete: z.number().optional(),
	estimatedExpenseRevenue: z.number().optional(),
	estimatedHours: z.number().optional(),
	estimatedProductRevenue: z.number().optional(),
	estimatedStart: z.string().optional(),
	estimatedTimeRevenue: z.number().optional(),
	expenseApprover: referenceTypeSchema.optional(),
	includeDependenciesFlag: z.boolean().optional(),
	includeEstimatesFlag: z.boolean().optional(),
	location: referenceTypeSchema.optional(),
	department: referenceTypeSchema.optional(),
	manager: referenceTypeSchema.optional(),
	name: z.string().optional(),
	opportunity: referenceTypeSchema.optional(),
	projectTemplateId: z.number().optional(),
	restrictDownPaymentFlag: z.boolean().optional(),
	scheduledEnd: z.string().optional(),
	scheduledHours: z.number().optional(),
	scheduledStart: z.string().optional(),
	shipToCompany: referenceTypeSchema.optional(),
	shipToContact: referenceTypeSchema.optional(),
	shipToSite: referenceTypeSchema.optional(),
	site: referenceTypeSchema.optional(),
	status: referenceTypeSchema.optional(),
	closedFlag: z.boolean().optional(),
	timeApprover: referenceTypeSchema.optional(),
	type: referenceTypeSchema.optional(),
	doNotDisplayInPortalFlag: z.boolean().optional(),
	billingStartDate: z.string().optional(),
	poAmount: z.number().optional(),
	estimatedTimeCost: z.number().optional(),
	estimatedExpenseCost: z.number().optional(),
	estimatedProductCost: z.number().optional(),
	taxCode: referenceTypeSchema.optional(),
	companyLocation: referenceTypeSchema.optional(),
});

export const ticketNoteSchema = z.object({
	id: z.number().optional(),
	ticketId: z.number().optional(),
	text: z.string().optional(),
	detailDescriptionFlag: z.boolean().optional(),
	internalAnalysisFlag: z.boolean().optional(),
	resolutionFlag: z.boolean().optional(),
	issueFlag: z.boolean().optional(),
	member: referenceTypeSchema.optional(),
	dateCreated: z.string().optional(),
	createdBy: z.string().optional(),
	internalFlag: z.boolean().optional(),
	externalFlag: z.boolean().optional(),
});

export const locationSchema = z.object({
	id: z.number(),
	ownerLevelId: z.number(),
	structureLevel: z.object({ id: z.number(), name: z.string() }),
	name: z.string(),
	manager: z.object({
		id: z.number(),
		identifier: z.string(),
		name: z.string(),
		dailyCapacity: z.number(),
	}),
	reportsTo: z.object({ id: z.number(), name: z.string() }),
	salesRep: z.string(),
	timeZoneSetup: z.object({ id: z.number(), name: z.string() }),
	calendar: z.object({ id: z.number(), name: z.string() }),
	overrideAddressLine1: z.string(),
	overrideAddressLine2: z.string(),
	overrideCity: z.string(),
	overrideState: z.string(),
	overrideZip: z.string(),
	overrideCountry: z.object({
		id: z.number(),
		identifier: z.string(),
		name: z.string(),
	}),
	overridePhoneNumber: z.string(),
	overrideFaxNumber: z.string(),
	owaUrl: z.string(),
	payrollXref: z.string(),
	locationFlag: z.boolean(),
	clientFlag: z.boolean(),
	workRoleIds: z.array(z.number()),
	departmentIds: z.array(z.number()),
});

export const communicationTypeSchema = z.object({
	id: z.number(),
	description: z.string(),
	phoneFlag: z.boolean(),
	faxFlag: z.boolean(),
	emailFlag: z.boolean(),
	defaultFlag: z.boolean(),
	exchangeXref: z.string(),
	iphoneXref: z.string(),
	androidXref: z.string(),
	googleXref: z.string(),
});

export const serviceTicketTaskSchema = z.object({
	id: z.number(),
	ticketId: z.number(),
	closedFlag: z.boolean(),
	priority: z.number(),
	childTicketId: z.number(),
	summary: z.string(),
});

export const configurationStatusSchema = z.object({
	id: z.number(),
	description: z.string(),
	closedFlag: z.boolean(),
	defaultFlag: z.boolean(),
});

export const configurationTypeSchema = z.object({
	id: z.number(),
	name: z.string(),
	inactiveFlag: z.boolean(),
	systemFlag: z.boolean(),
});



export const createNoteSchema = z.object({
	text: z.string(),
	type: z.object({ id: z.number() }),
});

export const activitySchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  status: referenceTypeSchema,
  notes: z.string(),
  dateStart: z.string(),
  dateEnd: z.string(),
  assignedBy: referenceTypeSchema,
  assignTo: referenceTypeSchema,
  scheduleStatus: referenceTypeSchema,
	reminder: referenceTypeSchema,
    contact: referenceTypeSchema,
  notifyFlag: z.boolean(),
  mobileGuid: z.string(),
  _info: z.object({
    lastUpdated: z.string(),
    updatedBy: z.string(),
    dateEntered: z.string(),
    enteredBy: z.string()
  })
})

export type Activity = z.infer<typeof activitySchema>;
export type AuditType = z.infer<typeof auditTypeSchema>;
export type AuditTrailEntry = z.infer<typeof auditTrailEntrySchema>;
export type BoardStatus = z.infer<typeof boardStatusSchema>;
export type BoardType = z.infer<typeof boardTypeSchema>;
export type BoardSubType = z.infer<typeof boardTypeSchema>;
export type CustomField = z.infer<typeof customFieldSchema>;
export type CommunicationItem = z.infer<typeof communicationItemSchema>;
export type CommunicationType = z.infer<typeof communicationTypeSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type ConfigurationStatus = z.infer<typeof configurationStatusSchema>;
export type ConfigurationType = z.infer<typeof configurationTypeSchema>;
export type CompanyNote = z.infer<typeof companyNoteSchema>;
export type Document = z.infer<typeof documentSchema>;
export type Location = z.infer<typeof locationSchema>;
export type Project = z.infer<typeof projectSchema>;
export type ReferenceType = z.infer<typeof referenceTypeSchema>;
export type ServiceTicket = z.infer<typeof serviceTicketSchema>;
export type ServiceTicketTask = z.infer<typeof serviceTicketTaskSchema>;
export type SystemMember = z.infer<typeof systemMemberSchema>;
export type TicketNote = z.infer<typeof ticketNoteSchema>;
export type TimeEntry = z.infer<typeof timeEntrySchema>;

export interface Configuration {
	id: number;
	name: string;
	type: ReferenceType;
	status: ReferenceType;
	company: ReferenceType;
	contact: ReferenceType;
	site: ReferenceType;
	locationId: number;
	location: Location;
	businessUnitId: number;
	department: ReferenceType;
	deviceIdentifier: string;
	serialNumber: string;
	modelNumber: string;
	tagNumber: string;
	purchaseDate: string;
	installationDate: string;
	warrantyExpirationDate: string;
	vendorNotes: string;
	notes: string;
	macAddress: string;
	lastLoginName: string;
	billFlag: boolean;
	backupSuccesses: number;
	backupIncomplete: number;
	backupFailed: number;
	backupRestores: number;
	backupServerName: string;
	backupBillableSpaceGb: number;
	backupProtectedDeviceList: string;
	backupYear: number;
	backupMonth: number;
	ipAddress: string;
	defaultGateway: string;
	osType: string;
	osInfo: string;
	cpuSpeed: string;
	ram: string;
	localHardDrives: string;
	manufacturer: ReferenceType;
	activeFlag: boolean;
	managementLink: string;
	remoteLink: string;
	mobileGuid: string;
	companyLocationId: number;
	showRemoteFlag: boolean;
	showAutomateFlag: boolean;
	needsRenewalFlag: boolean;
}

export interface Currency {
	id: number;
	symbol: string;
	currencyCode: string;
	decimalSeparator: string;
	numberOfDecimals: number;
	thousandsSeparator: string;
	negativeParenthesesFlag: boolean;
	displaySymbolFlag: boolean;
	currencyIdentifier: string;
	displayIdFlag: boolean;
	rightAlign: boolean;
	name: string;
}

export interface Company {
	id: number;
	identifier: string;
	name: string;
	status: ReferenceType;
	addressLine1: string;
	addressLine2: string;
	city: string;
	state: string;
	zip: string;
	country: ReferenceType;
	phoneNumber: string;
	faxNumber: string;
	website: string;
	territory: ReferenceType;
	market: ReferenceType;
	accountNumber: string;
	defaultContact: ReferenceType;
	dateAcquired: string;
	sicCode: ReferenceType;
	parentCompany: ReferenceType;
	annualRevenue: number;
	numberOfEmployees: number;
	yearEstablished: number;
	revenueYear: number;
	ownershipType: ReferenceType;
	timeZoneSetup: ReferenceType;
	leadSource: string;
	leadFlag: boolean;
	unsubscribeFlag: boolean;
	calendar: ReferenceType;
	userDefinedField1: string;
	userDefinedField2: string;
	userDefinedField3: string;
	userDefinedField4: string;
	userDefinedField5: string;
	userDefinedField6: string;
	userDefinedField7: string;
	userDefinedField8: string;
	userDefinedField9: string;
	userDefinedField10: string;
	vendorIdentifier: string;
	taxIdentifier: string;
	taxCode: ReferenceType;
	billingTerms: ReferenceType;
	invoiceTemplate: ReferenceType;
	pricingSchedule: ReferenceType;
	companyEntityType: ReferenceType;
	billToCompany: ReferenceType;
	billingSite: ReferenceType;
	billingContact: ReferenceType;
	invoiceDeliveryMethod: ReferenceType;
	invoiceToEmailAddress: string;
	invoiceCCEmailAddress: string;
	deletedFlag: boolean;
	dateDeleted: string;
	deletedBy: string;
	mobileGuid: string;
	facebookUrl: string;
	twitterUrl: string;
	linkedInUrl: string;
	currency: Currency;
	territoryManager: ReferenceType;
	resellerIdentifier: string;
	isVendorFlag: boolean;
	types: ReferenceType[];
	site: ReferenceType;
	integratorTags: string[];
	customFields: ReferenceType[];
}

export type RecordType =
	| 'Activity'
	| 'Agreement'
	| 'Company'
	| 'Config'
	| 'Configuration'
	| 'Contact'
	| 'CustomImage'
	| 'Document'
	| 'Expense'
	| 'HTMLTemplate'
	| 'Invoice'
	| 'Opportunity'
	| 'Project'
	| 'ProjectActivity'
	| 'PurchaseOrder'
	| 'Rma'
	| 'SalesOrder'
	| 'Service'
	| 'Ticket'
	| 'ProjectTicket'
	| 'ServiceTemplate'
	| 'StandardServiceTemplate'
	| 'SrDetail'
	| 'TimeEntry'
	| 'JobHeader'
	| 'MarketingManagerAudit'
	| 'KnowledgeBase'
	| 'ToolbarIcon'
	| 'Meeting'
	| 'MeetingNote'
	| 'ProductSetup'
	| 'ProjectTemplateTicket'
	| 'BillingSetup'
	| 'ServiceBoard'
	| 'WordTemplate'
	| 'Member'
	| 'PortalImagePortalLogo'
	| 'PortalImageReportLogo'
	| 'TopNavigationLogo'
	| 'PhaseStatus'
	| 'ProjectStatus'
	| 'TicketStatus'
	| 'Schedule'
	| 'Priority'
	| 'Unassigned';

export interface Schedule {
	id: number;
	name: string;
	holidayList: ReferenceType;
	mondayStartTime: string;
	mondayEndTime: string;
	tuesdayStartTime: string;
	tuesdayEndTime: string;
	wednesdayStartTime: string;
	wednesdayEndTime: string;
	thursdayStartTime: string;
	thursdayEndTime: string;
	fridayStartTime: string;
	fridayEndTime: string;
	saturdayStartTime: string;
	saturdayEndTime: string;
	sundayStartTime: string;
	sundayEndTime: string;
}

export interface Holiday {
	id: number;
	name: string;
	allDayFlag: boolean;
	date: string;
	timeStart: string;
	timeEnd: string;
	holidayList: ReferenceType;
}

export interface Site {
	id: number;
	name: string;
	addressLine1: string;
	addressLine2: string;
	city: string;
	stateReference: ReferenceType;
	zip: string;
	country: ReferenceType;
	addressFormat: string;
	phoneNumber: string;
	phoneNumberExt: string;
	faxNumber: string;
	taxCode: ReferenceType;
	entityType: ReferenceType;
	expenseReimbursement: number;
	primaryAddressFlag: boolean;
	defaultShippingFlag: boolean;
	defaultBillingFlag: boolean;
	defaultMailingFlag: boolean;
	inactiveFlag: boolean;
	billSeparateFlag: boolean;
	mobileGuid: string;
	calendar: ReferenceType;
	timeZone: ReferenceType;
	company: ReferenceType;
	customFields: CustomField[];
}

export interface Note {
	id: number;
	text: string;
	type: ReferenceType;
	flagged: boolean;
	enteredBy: string;
	company: ReferenceType;
}

export interface Priority {
	id: number;
	name: string;
	color: string;
	sortOrder: number;
	defaultFlag: boolean;
	imageLink: string;
	urgencySortOrder: string;
	level: string;
}

export interface Board {
	id: number;
	name: string;
	location: Location;
	department: ReferenceType;
	inactiveFlag: boolean;
	signOffTemplate: ReferenceType;
	sendToContactFlag: boolean;
	contactTemplate: ReferenceType;
	sendToResourceFlag: boolean;
	resourceTemplate: ReferenceType;
	projectFlag: boolean;
	showDependenciesFlag: boolean;
	showEstimatesFlag: boolean;
	boardIcon: ReferenceType;
	billTicketsAfterClosedFlag: boolean;
	billTicketSeparatelyFlag: boolean;
	billUnapprovedTimeExpenseFlag: boolean;
	overrideBillingSetupFlag: boolean;
	dispatchMember: ReferenceType;
	serviceManagerMember: ReferenceType;
	dutyManagerMember: ReferenceType;
	oncallMember: ReferenceType;
	workRole: ReferenceType;
	workType: ReferenceType;
	billTime: string;
	billExpense: string;
	billProduct: string;
	autoCloseStatus: ReferenceType;
	autoAssignNewTicketsFlag: boolean;
	autoAssignNewECTicketsFlag: boolean;
	autoAssignNewPortalTicketsFlag: boolean;
	discussionsLockedFlag: boolean;
	timeEntryLockedFlag: boolean;
	notifyEmailFrom: string;
	notifyEmailFromName: string;
	closedLoopDiscussionsFlag: boolean;
	closedLoopResolutionFlag: boolean;
	closedLoopInternalAnalysisFlag: boolean;
	timeEntryDiscussionFlag: boolean;
	timeEntryResolutionFlag: boolean;
	timeEntryInternalAnalysisFlag: boolean;
	problemSort: string;
	resolutionSort: string;
	internalAnalysisSort: string;
	emailConnectorAllowReopenClosedFlag: boolean;
	emailConnectorReopenStatus: ReferenceType;
	emailConnectorReopenResourcesFlag: boolean;
	emailConnectorNewTicketNoMatchFlag: boolean;
	emailConnectorNeverReopenByDaysFlag: boolean;
	emailConnectorReopenDaysLimit: number;
	emailConnectorNeverReopenByDaysClosedFlag: boolean;
	emailConnectorReopenDaysClosedLimit: number;
	useMemberDisplayNameFlag: boolean;
	sendToCCFlag: boolean;
	autoAssignTicketOwnerFlag: boolean;
	autoAssignLimitFlag: boolean;
	autoAssignLimitAmount: number;
	closedLoopAllFlag: boolean;
	percentageCalculation: string;
	allSort: string;
	markFirstNoteIssueFlag: boolean;
	restrictBoardByDefaultFlag: boolean;
	sendToBundledFlag: boolean;
}
