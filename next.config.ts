import path from 'node:path';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 100],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      'motion/react': path.resolve(process.cwd(), 'lib/static-motion.tsx'),
    };

    return config;
  },
};

export default nextConfig;
