import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
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
			config.resolve.alias['yjs'] = path.resolve(__dirname, 'node_modules/yjs');
		}
		config.module.exprContextCritical = false; // Workaround to suppress next-i18next warning, see https://github.com/isaachinman/next-i18next/issues/1545

		return config;
	},
	redirects: async () => {
		return [
			{
				source: '/my-issues',
				destination: '/my-issues/assigned',
				permanent: true
			},
			{
				source: '/projects',
				destination: '/projects/all',
				permanent: true
			},
			{
				source: '/tickets',
				destination: '/tickets/all',
				permanent: true
			}
		]
	},
	experimental: {
		reactCompiler: true,
	},
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
