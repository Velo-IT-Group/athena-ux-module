/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

let internalHost = null;

if (!isProd) {
	const { internalIpV4 } = await import('internal-ip');
	internalHost = await internalIpV4();
}
const nextConfig = {
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve = {
				...config.resolve,
				fallback: {
					// fixes proxy-agent dependencies
					net: false,
					dns: false,
					tls: false,
					assert: false,
					// fixes next-i18next dependencies
					path: false,
					fs: false,
					// fixes mapbox dependencies
					events: false,
					// fixes sentry dependencies
					process: false,
				},
			};
		}
		config.module.exprContextCritical = false; // Workaround to suppress next-i18next warning, see https://github.com/isaachinman/next-i18next/issues/1545

		return config;
	},
	output: 'export',
	images: {
		unoptimized: true,
	},
	// Configure assetPrefix or else the server won't properly resolve your assets.
	assetPrefix: isProd ? null : `http://${internalHost}:3000`,
};

export default nextConfig;
