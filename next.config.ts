import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			new URL('https://picsum.photos/**'),
			new URL('https://placehold.co/**'),
			new URL('https://assets.lummi.ai/**'),
			new URL('https://images.unsplash.com/**'),
		],
	},
	env: {
		NEXT_PUBLIC_API_BASE: 'http://localhost:3003/api',
	},
};

export default nextConfig;
