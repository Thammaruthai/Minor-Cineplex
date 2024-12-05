/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  //experimental: { optimizePackageImports: ["@chakra-ui/react"] },
  images: {
    domains: ["image.tmdb.org"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3-alpha-sig.figma.com",
        pathname: "/img/**", // Adjust the path based on your needs
      },
      {
        protocol: "https",
        hostname: "i.ebayimg.com",
        pathname: "/images/**", // Adjust the path if necessary
      },
      {
        protocol: "https",
        hostname: "cdn.majorcineplex.com",
        port: "",
        pathname: "/uploads/movie/**",
      },
      {
        protocol: "https",
        hostname: "dx35vtwkllhj9.cloudfront.net",
        pathname: "/**", // Matches all paths under this hostname
      },
      {
        protocol: 'https',
        hostname: 'deadline.com',
        port: '',
        pathname: '/wp-content/uploads/**', // Adjust this to match the specific path pattern
      },
      {
        protocol: 'https',
        hostname: 'f.ptcdn.info',
        port: '',
        pathname: '/**', // Adjusted to allow all paths under this hostname
      },
      {
        protocol: 'https',
        hostname: 'th-test-11.slatic.net',
        port: '',
        pathname: '/**', // This allows all paths under this hostname
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/images/**', // Allows all images under the `/images` path
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
};

export default nextConfig;
