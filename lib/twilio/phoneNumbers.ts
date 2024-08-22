'use server';
import { createClient } from '@/utils/twilio';

export const getPhoneNumbers = async () => {
	const client = createClient();
	// client.outgoingCallerIds.list({ limit: 100 });
	const phoneNumbers = await client.incomingPhoneNumbers.list({
		limit: 100,
	});

	return phoneNumbers.map((number) => {
		delete number['_context'];
		// @ts-ignore
		delete number['_proxy'];
		// @ts-ignore
		delete number['_solution'];
		// @ts-ignore
		delete number['_version'];
		// @ts-ignore
		delete number['toJSON'];
		// @ts-ignore
		delete number['update'];
		// @ts-ignore
		delete number['userDefinedMessages'];
		// @ts-ignore
		delete number['userDefinedMessageSubscriptions'];
		// @ts-ignore
		delete number['events'];
		// @ts-ignore
		delete number['_proxy'];
		// @ts-ignore
		delete number['_solution'];
		// @ts-ignore
		delete number['_version'];
		// @ts-ignore
		delete number['toJSON'];
		// @ts-ignore
		delete number['update'];
		// @ts-ignore
		delete number['userDefinedMessages'];
		// @ts-ignore
		delete number['userDefinedMessageSubscriptions'];
		// @ts-ignore
		delete number['events'];
		// @ts-ignore
		delete number['fetch'];
		// @ts-ignore
		delete number['notifications'];
		// @ts-ignore
		delete number['payments'];
		// @ts-ignore
		delete number['recordings'];
		// @ts-ignore
		delete number['remove'];
		// @ts-ignore
		delete number['siprec'];
		// @ts-ignore
		delete number['streams'];
		// @ts-ignore
		delete number['transcriptions'];
		return number;
	});
};
