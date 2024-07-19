import { useTwilio } from '@/providers/twilio-provider';

export const makeOutboundCall = async (data: FormData) => {
	const phoneNumber = data.get('phoneNumber');
	const to = data.get('phoneNumber') as string;
	const from = data.get('from') as string;
	const workflowSid = data.get('from') as string;
	const taskQueueSid = data.get('from') as string;
	console.log(data);
	const { worker } = useTwilio();
	await worker.createTask(
		'+19015988651',
		'+18449402678',
		'WW497b90bc1703176f6845c09c8bf4fa8a',
		'WQee659e96340b3899ad1fad7578fe6515',
		{
			attributes: {
				direction: 'outboundDial',
			},
		}
	);
};
