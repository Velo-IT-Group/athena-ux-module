/** @type {import('next').NextConfig} */
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
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
