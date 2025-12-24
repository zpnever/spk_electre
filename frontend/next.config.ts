import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	allowedDevOrigins: ["103.103.22.103"],
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "http://103.103.22.103:4001/api/:path*",
			},
		];
	},
};

export default nextConfig;
