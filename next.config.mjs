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
    ],
  },
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        tls: false,
        net: false,
        dns: false,
        "pg-native": false, // Prevents 'pg-native' from being resolved
      };
    }
    return config;
  },
};

export default nextConfig;
