'use server';
import { Twilio } from 'twilio';
import { FlowListInstanceOptions } from 'twilio/lib/rest/studio/v2/flow';
import { ExecutionListInstanceOptions } from 'twilio/lib/rest/studio/v2/flow/execution';

const client = new Twilio(process.env.NEXT_PUBLIC_TWILIO_API_KEY_SID, process.env.NEXT_PUBLIC_TWILIO_API_KEY_SECRET, {
	accountSid: process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
});

export const listFlows = async (options: FlowListInstanceOptions = {}) => {
	return await client.studio.v2.flows.list(options);
};

export const getFlow = async (sid: string) => {
	return await client.studio.v2.flows(sid).fetch();
};

export const listFlowExecutions = async (sid: string, options: ExecutionListInstanceOptions = {}) => {
	return await client.studio.v2.flows(sid).executions.list(options);
};
