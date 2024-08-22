'use server';
import { createClient } from '@/utils/twilio';
import { FlowListInstanceOptions } from 'twilio/lib/rest/studio/v2/flow';
import { ExecutionListInstanceOptions } from 'twilio/lib/rest/studio/v2/flow/execution';

export const listFlows = async (options: FlowListInstanceOptions = {}) => {
	const client = await createClient();

	return await client.studio.v2.flows.list(options);
};

export const getFlow = async (sid: string) => {
	const client = await createClient();

	return await client.studio.v2.flows(sid).fetch();
};

export const listFlowExecutions = async (sid: string, options: ExecutionListInstanceOptions = {}) => {
	const client = await createClient();

	return await client.studio.v2.flows(sid).executions.list(options);
};
