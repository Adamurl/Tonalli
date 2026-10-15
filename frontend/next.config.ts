import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const backendUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    root: projectRoot,
  },
  async rewrites() {
    return [
      {
        source: "/api/calendar/:date",
        destination: `${backendUrl}/calendar/:date`,
      },
    ];
  },
};

export default nextConfig;
