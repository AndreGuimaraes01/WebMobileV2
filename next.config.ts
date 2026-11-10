import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // A API lê data/alertas.json com fs, então o arquivo precisa ir junto no deploy
  outputFileTracingIncludes: {
    '/api/alertas': ['./data/alertas.json'],
    '/api/alertas/[id]': ['./data/alertas.json'],
  },
};

export default nextConfig;
