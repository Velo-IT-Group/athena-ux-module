'use client';
import { IApi, init, RequestedBrowserTransport } from '@gnaudio/jabra-js';

export const initalizeJabra = async () => {
	try {
		const config = {
			transport: RequestedBrowserTransport.WEB_HID,
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
