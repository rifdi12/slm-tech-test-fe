/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const isValidUrl = apiUrl && (apiUrl.startsWith('http://') || apiUrl.startsWith('https://'));

const nextConfig = {
  output: 'standalone',
  async rewrites() {
    if (!isValidUrl) return [];
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
