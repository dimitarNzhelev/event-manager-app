/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  async rewrites() {
    return [
      {
        source: '/grafana/:path*',
        destination: 'http://kps-grafana:80/:path*',
      },
    ];
  },
};

export default config;