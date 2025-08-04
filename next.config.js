/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/insta-simple',
  assetPrefix: '/insta-simple',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // 画像最適化を無効化
  images: {
    unoptimized: true,
  },
  // 静的最適化を制御
  poweredByHeader: false,
  // 実験的機能を無効化
  experimental: {
    ppr: false,
  },
}

module.exports = nextConfig