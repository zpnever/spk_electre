import type { NextConfig } from "next";

const nextConfig = {
	async rewrites() {
		return [
			{
				source: "/api-backend/:path*",
				destination: "http://103.103.22.103:4001/api/:path*",
			},
		];
	},
};

export default nextConfig;
