import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    qualities: [95],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);