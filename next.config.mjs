/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  images: {
    unoptimized: true, // S3 호스팅을 위해 이미지 최적화 비활성화
  },
};

// Merge MDX config with Next.js config
export default nextConfig;
