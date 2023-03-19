/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['d3-scale', '@visx/scale']
}

module.exports = nextConfig
