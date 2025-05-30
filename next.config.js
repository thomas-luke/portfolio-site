/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Configure for GitHub Pages subdirectory deployment
  basePath: '/portfolio-site',
  assetPrefix: '/portfolio-site/',
}

module.exports = nextConfig
