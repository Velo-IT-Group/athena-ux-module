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

export const preflightTestReportSchema = z.object({
  callSid: z.string(),
  edge: z.string(),
  iceCandidateStats: z.string(),
  networkTiming: z.object({
    signaling: z.object({
      start: z.number(),
      end: z.number(),
      duration: z.number()
    }),
    dtls: z.object({
      start: z.number(),
      end: z.number(),
      duration: z.number()
    }),
    ice: z.object({ start: z.number(), end: z.number(), duration: z.number() }),
    peerConnection: z.object({
      start: z.number(),
      end: z.number(),
      duration: z.number()
    })
  }),
  samples: z.array(
    z.object({
      audioInputLevel: z.number(),
      audioOutputLevel: z.number(),
      bytesReceived: z.number(),
      bytesSent: z.number(),
      codecName: z.string(),
      jitter: z.number(),
      mos: z.null(),
      packetsLost: z.number(),
      packetsLostFraction: z.number(),
      packetsReceived: z.number(),
      packetsSent: z.number(),
      rtt: z.number(),
      timestamp: z.number(),
      totals: z.object({
        bytesReceived: z.number(),
        bytesSent: z.number(),
        packetsLost: z.number(),
        packetsLostFraction: z.number(),
        packetsReceived: z.number(),
        packetsSent: z.number()
      })
    })
  ),
  selectedEdge: z.string(),
  stats: z.object({
    jitter: z.object({ average: z.number(), max: z.number(), min: z.number() }),
    mos: z.object({ average: z.number(), max: z.number(), min: z.number() }),
    rtt: z.object({ average: z.number(), max: z.number(), min: z.number() })
  }),
  testTiming: z.object({
    start: z.number(),
    end: z.number(),
    duration: z.number()
  }),
  totals: z.object({
    bytesReceived: z.number(),
    bytesSent: z.number(),
    packetsLost: z.number(),
    packetsLostFraction: z.number(),
    packetsReceived: z.number(),
    packetsSent: z.number()
  }),
  warnings: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      rtcWarning: z.object({
        values: z.array(z.number()),
        samples: z.array(
          z.object({
            audioInputLevel: z.number(),
            audioOutputLevel: z.number(),
            bytesReceived: z.number(),
            bytesSent: z.number(),
            codecName: z.string(),
            jitter: z.number(),
            mos: z.number(),
            packetsLost: z.number(),
            packetsLostFraction: z.number(),
            packetsReceived: z.number(),
            packetsSent: z.number(),
            rtt: z.number(),
            timestamp: z.number(),
            totals: z.object({
              bytesReceived: z.number(),
              bytesSent: z.number(),
              packetsLost: z.number(),
              packetsLostFraction: z.number(),
              packetsReceived: z.number(),
              packetsSent: z.number()
            })
          })
        ),
        name: z.string(),
        threshold: z.object({ name: z.string(), value: z.number() })
      })
    })
  ),
  selectedIceCandidatePairStats: z.object({
    localCandidate: z.object({
      id: z.string(),
      timestamp: z.number(),
      type: z.string(),
      transportId: z.string(),
      isRemote: z.boolean(),
      networkType: z.string(),
      ip: z.string(),
      address: z.string(),
      port: z.number(),
      protocol: z.string(),
      candidateType: z.string(),
      priority: z.number()
    }),
    remoteCandidate: z.object({
      id: z.string(),
      timestamp: z.number(),
      type: z.string(),
      transportId: z.string(),
      isRemote: z.boolean(),
      ip: z.string(),
      address: z.string(),
      port: z.number(),
      protocol: z.string(),
      candidateType: z.string(),
      priority: z.number()
    })
  }),
  isTurnRequired: z.boolean(),
  callQuality: z.string()
})

export type PreflightTestReport = z.infer<typeof preflightTestReportSchema>