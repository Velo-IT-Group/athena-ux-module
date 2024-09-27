'use client';
import { IApi, IConfig, init, RequestedBrowserTransport } from '@gnaudio/jabra-js';

export const initalizeJabra = async () => {
	try {
		const config: IConfig = {
			transport: RequestedBrowserTransport.WEB_HID,
			partnerKey: '3ece-ad184817-dc81-4d55-b6f3-9a2fb6edd166'
		};

		// Initialize the Jabra SDK
		const jabra = await init(config).catch((err) => {
			console.error(err);
		});

		if (!jabra) throw new Error('The Jabra SDK failed to initialize. See error above for more details.');

		return jabra;
	} catch (err) {
		console.error(err);
		throw new Error(err as string);
	}
};
