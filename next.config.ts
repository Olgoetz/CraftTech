import type { NextConfig } from "next";
import { MAX_FILE_SIZE } from "./constants";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: `${MAX_FILE_SIZE / (1024 * 1024)}mb`,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
