/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'i.ytimg.com',
      'yt3.ggpht.com',
      'avatar.vercel.sh'
    ],
  },
};

module.exports = nextConfig;
