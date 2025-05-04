/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['firebasestorage.googleapis.com'],
  },
  trailingSlash: true,
  experimental: {
    scrollRestoration: true
  },
  output: 'export',
  cleanDistDir: true,
  distDir: '.next',
  assetPrefix: '/',
  basePath: '',
}

export default nextConfig
