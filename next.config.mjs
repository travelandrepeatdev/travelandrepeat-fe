/** @type {import('next').NextConfig} */

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    AWS_BUCKET_ACCESS_KEY_ID: process.env.AWS_BUCKET_ACCESS_KEY_ID,
    AWS_BUCKET_SECRET_ACCESS_KEY: process.env.AWS_BUCKET_SECRET_ACCESS_KEY,
    AWS_BUCKET_ENDPOINT: process.env.AWS_BUCKET_ENDPOINT,
    AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;