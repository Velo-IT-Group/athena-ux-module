export type ProjectTemplate = {
	id: number;
	name: string;
	description?: string;
	type?: ProjectType;
	workplan?: ProjectWorkPlan;
};

export type ProjectType = {
	id: number;
	name: string;
	defaultFlag?: boolean;
	inactiveFlag?: boolean;
};

export type TicketNote = {
	id: number;
	ticketId: number;
	text: string;
	detailDescriptionFlag: boolean;
	internalAnalysisFlag: boolean;
	resolutionFlag: boolean;
	issueFlag: boolean;
	member: {
		id: number;
		identifier: string;
		name: string;
	};
	dateCreated: string;
	createdBy: string;
	internalFlag: boolean;
	externalFlag: boolean;
	sentimentScore: number;
};

export type ProjectPhase = {
	id: number;
	templateId: number;
	projectId?: number;
	description: string;
	markAsMilestoneFlag: boolean;
	billPhaseSeparately: boolean;
	wbsCode: string;
	tickets: Array<ProjectTemplateTicket>;
};

export type ProjectTemplateTicket = {
	id: number;
	projectTemplateId?: number;
	projectTemplatePhaseId?: number;
	lineNumber?: number;
	description?: string;
	notes?: string;
	internalAnalysis?: string;
	resolution?: string;
	budgetHours: number;
	duration?: number;
	summary: string;
	wbsCode?: string;
	billSeparatelyFlag?: boolean;
	markAsMilestoneFlag?: boolean;
	tasks?: Array<ProjectTemplateTask>;
	recordType?: string;
	pmTmpProjectRecID?: number;
	priority?: {
		id: number;
		name: string;
		sort: number;
		level: string;
		_info: {
			additionalProp1: string;
			additionalProp2: string;
			additionalProp3: string;
		};
	};
	source?: {
		id: number;
		name: string;
		_info: {
			additionalProp1: string;
			additionalProp2: string;
			additionalProp3: string;
		};
	};
	workRole?: {
		id: number;
		name: string;
		_info: {
			additionalProp1: string;
			additionalProp2: string;
			additionalProp3: string;
		};
	};
	workType?: {
		id: number;
		name: string;
		_info: {
			additionalProp1: string;
			additionalProp2: string;
			additionalProp3: string;
		};
	};
};

export type ProjectTemplateTask = {
	id: number;
	ticketId?: number;
	sequence?: number;
	notes?: string;
	description?: string;
	priority?: number;
	summary?: string;
};

export type ProjectWorkPlan = {
	templateId: number;
	phases: Array<ProjectPhase>;
};

export type ProductClass = 'Agreement' | 'Bundle' | 'Inventory' | 'NonInventory' | 'Service';

export type CatalogItem = {
	id: number;
	identifier?: string;
	description?: string;
	inactiveFlag?: boolean;
	subcategory?: ReferenceType;
	type?: ReferenceType;
	productClass: ProductClass;
	bundledItems?: CatalogItem[] | undefined;
	serializedFlag?: boolean;
	serializedCostFlag?: boolean;
	phaseProductFlag?: boolean;
	unitOfMeasure?: ReferenceType;
	price?: number;
	cost?: number;
	priceAttribute?: string;
	taxableFlag?: boolean;
	dropShipFlag?: boolean;
	specialOrderFlag?: boolean;
	customerDescription?: string;
	manufacturer?: ReferenceType;
	manufacturerPartNumber?: string;
	vendor?: ReferenceType;
	vendorSku?: string;
	notes?: string;
	integrationXRef?: string;
	sla?: ReferenceType;
	entityType?: ReferenceType;
	recurringFlag?: boolean;
	recurringRevenue?: number;
	recurringCost?: number;
	recurringOneTimeFlag?: boolean;
	recurringBillCycle?: ReferenceType;
	recurringCycleType?: string;
	calculatedPriceFlag?: boolean;
	calculatedCostFlag?: boolean;
	category?: ReferenceType;
	calculatedPrice?: number;
	calculatedCost?: number;
	billableOption?: string;
};

export type CatalogComponent = {
	id: number;
	sequenceNumber: number;
	quantity: number;
	catalogItem: CatalogItem;
	hidePriceFlag: boolean;
	hideItemIdentifierFlag: boolean;
	hideDescriptionFlag: boolean;
	hideQuantityFlag: boolean;
	hideExtendedPriceFlag: boolean;
	parentCatalogItem: { id: number };
	price: number;
	cost: number;
};
export interface SystemMember {
	id: number;
	identifier: string;
	firstName: string;
	lastName: string;
}

export interface Priority {
	id: number;
	name: string;
	color: string;
	sortOrder: number;
	defaultFlag: boolean;
}

export interface ServiceTicket {
	id: number;
	summary: string;
	recordType?: string;
	board?: ReferenceType;
	status?: ReferenceType;
	workRole?: ReferenceType;
	workType?: ReferenceType;
	company?: ReferenceType;
	site?: ReferenceType;
	siteName?: string;
	addressLine1?: string;
	addressLine2?: string;
	city?: string;
	stateIdentifier?: string;
	zip?: string;
	country?: ReferenceType;
	contact?: ReferenceType;
	contactName?: string;
	contactPhoneNumber?: string;
	contactPhoneExtension?: string;
	contactEmailAddress?: string;
	type?: ReferenceType;
	subType?: ReferenceType;
	item?: ReferenceType;
	team?: ReferenceType;
	owner?: ReferenceType;
	priority?: ReferenceType;
	serviceLocation?: ReferenceType;
	source?: ReferenceType;
	requiredDate?: string;
	budgetHours?: number;
	opportunity?: ReferenceType;
	agreement?: ReferenceType;
	severity?: string;
	impact?: string;
	externalXRef?: string;
	poNumber?: string;
	knowledgeBaseCategoryId?: number;
	knowledgeBaseSubCategoryId?: number;
	allowAllClientsPortalView?: boolean;
	customerUpdatedFlag?: boolean;
	automaticEmailContactFlag?: boolean;
	automaticEmailResourceFlag?: boolean;
	automaticEmailCcFlag?: boolean;
	automaticEmailCc?: string;
	initialDescription?: string;
	initialInternalAnalysis?: string;
	initialResolution?: string;
	initialDescriptionFrom?: string;
	contactEmailLookup?: string;
	processNotifications?: boolean;
	skipCallback?: boolean;
	closedDate?: string;
	closedBy?: string;
	closedFlag?: boolean;
	actualHours?: number;
	approved?: boolean;
	estimatedExpenseCost?: number;
	estimatedExpenseRevenue?: number;
	estimatedProductCost?: number;
	estimatedProductRevenue?: number;
	estimatedTimeCost?: number;
	estimatedTimeRevenue?: number;
	billingMethod?: string;
	billingAmount?: number;
	hourlyRate?: number;
	subBillingMethod?: string;
	subBillingAmount?: number;
	subDateAccepted?: string;
	dateResolved?: string;
	dateResplan?: string;
	dateResponded?: string;
	resolveMinutes?: number;
	resPlanMinutes?: number;
	respondMinutes?: number;
	isInSla?: boolean;
	knowledgeBaseLinkId?: number;
	resources?: string;
	parentTicketId?: number;
	hasChildTicket?: boolean;
	hasMergedChildTicketFlag?: boolean;
	knowledgeBaseLinkType?: string;
	billTime?: string;
	billExpenses?: string;
	billProducts?: string;
	predecessorType?: string;
	predecessorId?: number;
	predecessorClosedFlag?: boolean;
	lagDays?: number;
	lagNonworkingDaysFlag?: boolean;
	estimatedStartDate?: string;
	duration?: number;
	location?: Location;
	department?: ReferenceType;
	mobileGuid?: string;
	sla?: ReferenceType;
	slaStatus?: string;
	requestForChangeFlag?: boolean;
	currency?: Currency;
	mergedParentTicket?: ReferenceType;
	integratorTags?: string[];
	escalationStartDateUTC?: string;
	escalationLevel?: number;
	minutesBeforeWaiting?: number;
	respondedSkippedMinutes?: number;
	resplanSkippedMinutes?: number;
	respondedHours?: number;
	respondedBy?: string;
	resplanHours?: number;
	resplanBy?: string;
	resolutionHours?: number;
	resolvedBy?: string;
	minutesWaiting?: number;
}

export interface Opportunity {
	id: number;
	name: string;
	expectedCloseDate: string;
	type: ReferenceType;
	stage: ReferenceType;
	status: ReferenceType;
	priority: ReferenceType;
	probability: ReferenceType;
	rating: ReferenceType;
	primarySalesRep: ReferenceType;
	locationId: number;
	businessUnitId: number;
	company: ReferenceType;
	contact: ReferenceType;
	site: ReferenceType;
	dateBecameLead: string;
	totalSalesTax: number;
	shipToCompany: ReferenceType;
	shipToSite: ReferenceType;
	billToCompany: ReferenceType;
	billToContact: ReferenceType;
	billToSite: ReferenceType;
	billingTerms: ReferenceType;
	currency: Currency;
	companyLocationId: number;
}

export interface ProductsItem {
	id: number;
	catalogItem: CatalogItem;
	description?: string;
	sequenceNumber?: number;
	quantity?: number;
	unitOfMeasure?: ReferenceType;
	price: number;
	cost: number;
	extPrice: number;
	extCost: number;
	discount?: number;
	margin?: number;
	agreementAmount?: number;
	priceMethod?: string;
	billableOption?: string;
	agreement?: ReferenceType;
	locationId?: number;
	location?: ReferenceType;
	businessUnitId?: number;
	businessUnit?: ReferenceType;
	vendor?: ReferenceType;
	vendorSku?: string;
	taxableFlag?: boolean;
	dropshipFlag?: boolean;
	specialOrderFlag?: boolean;
	phaseProductFlag?: boolean;
	cancelledFlag?: boolean;
	quantityCancelled?: number;
	cancelledReason?: string;
	customerDescription?: string;
	internalNotes?: string;
	productSuppliedFlag?: boolean;
	subContractorShipToId?: number;
	subContractorAmountLimit?: number;
	recurring?: Recurring;
	sla?: ReferenceType;
	entityType?: ReferenceType;
	ticket?: ReferenceType;
	project?: ReferenceType;
	phase?: ReferenceType;
	salesOrder?: ReferenceType;
	opportunity?: ReferenceType;
	invoice?: Invoice;
	warehouseId?: number;
	warehouseIdObject?: ReferenceType;
	warehouseBinId?: number;
	warehouseBinIdObject?: ReferenceType;
	calculatedPriceFlag?: boolean;
	calculatedCostFlag?: boolean;
	forecastDetailId?: number;
	cancelledBy?: number;
	cancelledDate?: string;
	warehouse?: string;
	warehouseBin?: string;
	purchaseDate?: string;
	taxCode?: ReferenceType;
	integrationXRef?: string;
	listPrice?: number;
	serialNumberIds?: Array<number>;
	serialNumbers?: Array<string>;
	company?: ReferenceType;
	forecastStatus?: ReferenceType;
	productClass?: string;
	needToPurchaseFlag?: boolean;
	needToOrderQuantity?: number;
	minimumStockFlag?: boolean;
	shipSet?: string;
	calculatedPrice?: number;
	calculatedCost?: number;
	poApprovedFlag?: boolean;
	uom?: string;
	addComponentsFlag?: boolean;
	ignorePricingSchedulesFlag?: boolean;
	asioSubscriptionsID?: string;
	bypassForecastUpdate?: boolean;
}

export interface Project {
	id: number;
	actualEnd?: string;
	actualHours?: number;
	actualStart?: string;
	agreement?: ReferenceType;
	billExpenses?: string;
	billingAmount?: number;
	billingAttention?: string;
	billingMethod?: string;
	billingRateType?: string;
	billingTerms?: ReferenceType;
	billProducts?: string;
	billProjectAfterClosedFlag?: boolean;
	billTime?: string;
	billToCompany?: ReferenceType;
	billToContact?: ReferenceType;
	billToSite?: ReferenceType;
	billUnapprovedTimeAndExpense?: boolean;
	board?: ReferenceType;
	budgetAnalysis?: string;
	budgetFlag?: boolean;
	budgetHours?: number;
	company?: ReferenceType;
	contact?: ReferenceType;
	customerPO?: string;
	description?: string;
	currency?: Currency;
	downpayment?: number;
	estimatedEnd?: string;
	percentComplete?: number;
	estimatedExpenseRevenue?: number;
	estimatedHours?: number;
	estimatedProductRevenue?: number;
	estimatedStart?: string;
	estimatedTimeRevenue?: number;
	expenseApprover?: ReferenceType;
	includeDependenciesFlag?: boolean;
	includeEstimatesFlag?: boolean;
	location?: ReferenceType;
	department?: ReferenceType;
	manager?: ReferenceType;
	name?: string;
	opportunity?: ReferenceType;
	projectTemplateId?: number;
	restrictDownPaymentFlag?: boolean;
	scheduledEnd?: string;
	scheduledHours?: number;
	scheduledStart?: string;
	shipToCompany?: ReferenceType;
	shipToContact?: ReferenceType;
	shipToSite?: ReferenceType;
	site?: ReferenceType;
	status?: ReferenceType;
	closedFlag?: boolean;
	timeApprover?: ReferenceType;
	type?: ReferenceType;
	doNotDisplayInPortalFlag?: boolean;
	billingStartDate?: string;
	poAmount?: number;
	estimatedTimeCost?: number;
	estimatedExpenseCost?: number;
	estimatedProductCost?: number;
	taxCode?: ReferenceType;
	companyLocation?: ReferenceType;
}

export interface Invoice {
	id: number;
	identifier: string;
	billingType: string;
	applyToType: string;
	invoiceDate: string;
	chargeFirmFlag: boolean;
}

export interface Recurring {
	recurringRevenue: number;
	recurringCost: number;
	startDate: string;
	endDate: string;
	billCycleId: number;
	billCycle: ReferenceType;
	cycles: number;
	cycleType: string;
}

export interface ReferenceType {
	id: number;
	identifier?: string;
	name: string;
}

export interface Note {
	id: number;
	ticketId: number;
	text: string;
	detailDescriptionFlag: boolean;
	internalAnalysisFlag: boolean;
	resolutionFlag: boolean;
	issueFlag: boolean;
	member: {
		id: number;
		identifier: string;
		name: string;
		dailyCapacity: number;
	};
	contact: ReferenceType;
	customerUpdatedFlag: boolean;
	processNotifications: boolean;
	internalFlag: boolean;
	externalFlag: boolean;
}
export interface Contact {
	id: number;
	firstName: string;
	lastName: string;
	company: ReferenceType;
	site: ReferenceType;
	addressLine1: string;
	addressLine2: string;
	city: string;
	state: string;
	school?: string;
	date?: string;
	zip: string;
	country: ReferenceType;
	relationshipOverride: string;
	inactiveFlag: boolean;
	managerContact: ReferenceType;
	title: string;
	nickName: string;
	marriedFlag: boolean;
	childrenFlag: boolean;
	significantOther: string;
	portalSecurityLevel: number;
	disablePortalLoginFlag: boolean;
	unsubscribeFlag: boolean;
	gender: string;
	birthDay: string;
	anniversary: string;
	mobileGuid: string;
	defaultPhoneType: string;
	defaultPhoneNbr: string;
	defaultBillingFlag: boolean;
	defaultFlag: boolean;
	communicationItems: CommunicationItem[];
	types: ReferenceType[];
	ignoreDuplicates: boolean;
}
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

export interface CommunicationItem {
	id: number;
	type: ReferenceType;
	value: string;
	defaultFlag: boolean;
	domain?: string;
	communicationType: string;
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

type AuditType =
	| 'Attachment'
	| 'Combined Tickets'
	| 'Company'
	| 'Configuration'
	| 'Contact'
	| 'Control'
	| 'Custom Field'
	| 'Date'
	| 'Email'
	| 'Finance'
	| 'Knowledge Base'
	| 'Meeting'
	| 'Notes'
	| 'Product'
	| 'Record'
	| 'Resource'
	| 'SLA'
	| 'Task'
	| 'Template'
	| 'Tickets'
	| 'Ticket Template'
	| 'Time Entry'
	| 'Workflow';

export interface AuditTrailEntry {
	text: string;
	enteredDate: string;
	enteredBy: string;
	auditType: AuditType;
	auditSubType: string;
	auditSource: string;
}

export interface Document {
	id: number;
	title: string;
	fileName: string;
	serverFileName: string;
	owner: string;
	linkFlag: boolean;
	imageFlag: boolean;
	publicFlag: boolean;
	htmlTemplateFlag: boolean;
	readOnlyFlag: boolean;
	size: number;
	urlFlag: boolean;
	createdOnDate: string;
	documentType: ReferenceType;
	guid: string;
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

export interface CustomField {
	id: number;
	caption: string;
	type: string;
	entryMethod: string;
	numberOfDecimals: number;
	value: Record<string, any>;
}

export interface BoardStatus {
	id: number;
	name: string;
	board: ReferenceType;
	sortOrder: number;
	displayOnBoard: boolean;
	inactive: boolean;
	closedStatus: boolean;
	timeEntryNotAllowed: boolean;
	roundRobinCatchall: boolean;
	defaultFlag: boolean;
	escalationStatus: string;
	customerPortalDescription: string;
	customerPortalFlag: boolean;
	emailTemplate: ReferenceType;
	statusIndicator: ReferenceType;
	customStatusIndicatorName: string;
	saveTimeAsNote: boolean;
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
