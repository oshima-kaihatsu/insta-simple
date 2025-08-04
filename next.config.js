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
  // 静的生成を完全に無効化
  output: 'export',
  trailingSlash: true,
  // 画像最適化を無効化（export使用時必須）
  images: {
    unoptimized: true,
  },
  // 動的機能を無効化
  experimental: {
    // 全ての実験的機能を無効化
    ppr: false,
    reactCompiler: false,
  },
}

module.exports = nextConfig