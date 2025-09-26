
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lucide-react', '@nathy/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com'
      }
    ],
  },
  //experimental: { urlImports: ['https://themer.sanity.build/'] },
}

export default nextConfig
